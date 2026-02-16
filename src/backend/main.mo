import AccessControl "authorization/access-control";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Blob "mo:core/Blob";
import Array "mo:core/Array";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import List "mo:core/List";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  // Types
  type JobProfile = {
    name : Text;
    education : Text;
    location : Text;
    profession : Text;
    experience : Nat;
    resume : ?Storage.ExternalBlob;
    minSalary : Nat;
    maxSalary : Nat;
  };

  type MatrimonialProfile = {
    name : Text;
    age : Nat;
    religion : Text;
    occupation : Text;
    preferredLocation : Text;
    minAge : Nat;
    maxAge : Nat;
    profilePicture : ?Storage.ExternalBlob;
  };

  public type UserProfile = {
    jobProfile : ?JobProfile;
    matrimonialProfile : ?MatrimonialProfile;
  };

  type JobListing = {
    id : Nat;
    title : Text;
    company : Text;
    location : Text;
    salaryRange : (Nat, Nat);
    experienceLevel : Text;
    jobType : Text;
    category : Text;
  };

  type JobApplication = {
    applicant : Principal;
    jobId : Nat;
    status : Text;
    dateApplied : Nat;
  };

  type Message = {
    from : Principal;
    to : Principal;
    content : Text;
    timestamp : Nat;
  };

  type Match = {
    user1 : Principal;
    user2 : Principal;
    compatibilityScore : Nat;
  };

  type Interest = {
    sender : Principal;
    recipient : Principal;
    status : Text;
  };

  // New Types for Recommendations (matching output format expected by TS)
  type JobRecommendation = {
    job : JobListing;
    matchScore : Nat;
    reason : Text;
  };

  type MatrimonialRecommendation = {
    profile : MatrimonialProfile;
    compatibilityScore : Nat;
    reason : Text;
  };

  type Recommendations = {
    jobs : [JobRecommendation];
    matches : [MatrimonialRecommendation];
  };

  type AIRecommendationResult = {
    recommendations : Recommendations;
    explanations : [Text];
  };

  // State
  let accessControlState = AccessControl.initState();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let jobProfiles = Map.empty<Principal, JobProfile>();
  let matrimonialProfiles = Map.empty<Principal, MatrimonialProfile>();
  let jobListings = Map.empty<Nat, JobListing>();
  let jobApplications = Map.empty<Nat, JobApplication>();
  let messages = Map.empty<Nat, Message>();
  let matches = Map.empty<Nat, Match>();
  let interests = Map.empty<Nat, Interest>();
  var nextJobId = 0;
  var nextApplicationId = 0;
  var nextMessageId = 0;
  var nextMatchId = 0;
  var nextInterestId = 0;

  // Helpers
  func generateJobId() : Nat {
    let id = nextJobId;
    nextJobId += 1;
    id;
  };

  func generateApplicationId() : Nat {
    let id = nextApplicationId;
    nextApplicationId += 1;
    id;
  };

  func generateMessageId() : Nat {
    let id = nextMessageId;
    nextMessageId += 1;
    id;
  };

  func generateMatchId() : Nat {
    let id = nextMatchId;
    nextMatchId += 1;
    id;
  };

  func generateInterestId() : Nat {
    let id = nextInterestId;
    nextInterestId += 1;
    id;
  };

  func validateAdmin(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  func validateUser(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
  };

  func hasAcceptedInterest(user1 : Principal, user2 : Principal) : Bool {
    interests.values().any(
      func(interest) {
        interest.status == "accepted" and
        ((interest.sender == user1 and interest.recipient == user2) or
         (interest.sender == user2 and interest.recipient == user1))
      }
    );
  };

  // Authentication
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // User Profile Management (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);

    // Sync with individual profile stores
    switch (profile.jobProfile) {
      case (?jp) { jobProfiles.add(caller, jp) };
      case null { jobProfiles.remove(caller) };
    };
    switch (profile.matrimonialProfile) {
      case (?mp) { matrimonialProfiles.add(caller, mp) };
      case null { matrimonialProfiles.remove(caller) };
    };
  };

  // Profile Management
  public shared ({ caller }) func createOrUpdateJobProfile(profile : JobProfile) : async () {
    validateUser(caller);
    jobProfiles.add(caller, profile);

    // Update user profile
    let currentProfile = switch (userProfiles.get(caller)) {
      case (?up) { up };
      case null { { jobProfile = null; matrimonialProfile = null } };
    };
    userProfiles.add(caller, {
      jobProfile = ?profile;
      matrimonialProfile = currentProfile.matrimonialProfile;
    });
  };

  public shared ({ caller }) func createOrUpdateMatrimonialProfile(profile : MatrimonialProfile) : async () {
    validateUser(caller);
    matrimonialProfiles.add(caller, profile);

    // Update user profile
    let currentProfile = switch (userProfiles.get(caller)) {
      case (?up) { up };
      case null { { jobProfile = null; matrimonialProfile = null } };
    };
    userProfiles.add(caller, {
      jobProfile = currentProfile.jobProfile;
      matrimonialProfile = ?profile;
    });
  };

  public query ({ caller }) func getJobProfile(user : Principal) : async ?JobProfile {
    // Allow users to view job profiles (public for job search)
    // But require at least user role
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    jobProfiles.get(user);
  };

  public query ({ caller }) func getMatrimonialProfile(user : Principal) : async ?MatrimonialProfile {
    // Matrimonial profiles require either:
    // 1. Viewing own profile
    // 2. Being an admin
    // 3. Having a mutual accepted interest
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };

    // Allow viewing own profile or if admin
    if (caller == user or AccessControl.isAdmin(accessControlState, caller)) {
      return matrimonialProfiles.get(user);
    };

    // Check for accepted interest between users
    if (hasAcceptedInterest(caller, user)) {
      return matrimonialProfiles.get(user);
    };

    Runtime.trap("Unauthorized: Can only view matrimonial profiles with accepted interest");
  };

  // Job Listings (full code required)
  public shared ({ caller }) func createJobListing(listing : JobListing) : async () {
    validateAdmin(caller);
    let jobId = generateJobId();
    let newListing = {
      listing with
      id = jobId;
    };
    jobListings.add(jobId, newListing);
  };

  public shared ({ caller }) func updateJobListing(jobId : Nat, listing : JobListing) : async () {
    validateAdmin(caller);
    switch (jobListings.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?_) {
        let updatedListing = {
          listing with
          id = jobId;
        };
        jobListings.add(jobId, updatedListing);
      };
    };
  };

  public shared ({ caller }) func deleteJobListing(jobId : Nat) : async () {
    validateAdmin(caller);
    jobListings.remove(jobId);
  };

  public query ({ caller }) func getJobListings() : async [JobListing] {
    // Public access - anyone including guests can view job listings
    jobListings.values().toArray();
  };

  public query ({ caller }) func getJobListingById(jobId : Nat) : async JobListing {
    // Public access - anyone including guests can view a specific job listing
    switch (jobListings.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?listing) { listing };
    };
  };

  // Job Applications (full code required)
  public shared ({ caller }) func applyForJob(jobId : Nat) : async () {
    validateUser(caller);

    // Verify job exists
    switch (jobListings.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?_) {};
    };

    // Check if already applied
    let alreadyApplied = jobApplications.values().any(
      func(existing) { existing.jobId == jobId and existing.applicant == caller }
    );

    if (alreadyApplied) {
      Runtime.trap("Already applied to this job");
    };

    let application : JobApplication = {
      applicant = caller;
      jobId;
      status = "applied";
      dateApplied = 0;
    };
    jobApplications.add(generateApplicationId(), application);
  };

  public query ({ caller }) func getCallerJobApplications() : async [JobApplication] {
    validateUser(caller);
    jobApplications.values().filter(
      func(app) { app.applicant == caller }
    ).toArray();
  };

  public query ({ caller }) func getJobApplicationsByApplicant(applicant : Principal) : async [JobApplication] {
    // Only allow viewing own applications or admin access
    if (caller != applicant and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own applications");
    };

    jobApplications.values().filter(
      func(app) { app.applicant == applicant }
    ).toArray();
  };

  public query ({ caller }) func getJobApplicationsByJobId(jobId : Nat) : async [JobApplication] {
    // Only admins can view all applications for a job
    validateAdmin(caller);

    jobApplications.values().filter(
      func(app) { app.jobId == jobId }
    ).toArray();
  };

  public shared ({ caller }) func updateApplicationStatus(applicationId : Nat, status : Text) : async () {
    validateAdmin(caller);

    switch (jobApplications.get(applicationId)) {
      case (null) { Runtime.trap("Application not found") };
      case (?app) {
        let updatedApp = { app with status = status };
        jobApplications.add(applicationId, updatedApp);
      };
    };
  };

  // Messaging
  public shared ({ caller }) func sendMessage(to : Principal, content : Text) : async () {
    validateUser(caller);

    // Verify recipient exists and is a user
    if (not (AccessControl.hasPermission(accessControlState, to, #user))) {
      Runtime.trap("Recipient must be a registered user");
    };

    let message : Message = {
      from = caller;
      to;
      content;
      timestamp = 0;
    };
    messages.add(generateMessageId(), message);
  };

  public query ({ caller }) func getCallerMessages(otherUser : Principal) : async [Message] {
    validateUser(caller);

    messages.values().filter(
      func(msg) {
        (msg.from == caller and msg.to == otherUser) or
        (msg.from == otherUser and msg.to == caller)
      }
    ).toArray();
  };

  public query ({ caller }) func getMessages(user1 : Principal, user2 : Principal) : async [Message] {
    // Only allow viewing messages if caller is one of the participants or admin
    if (caller != user1 and caller != user2 and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own messages");
    };

    messages.values().filter(
      func(msg) {
        (msg.from == user1 and msg.to == user2) or
        (msg.from == user2 and msg.to == user1)
      }
    ).toArray();
  };

  // Matches and Interests
  public shared ({ caller }) func saveMatch(user2 : Principal, compatibility : Nat) : async () {
    validateUser(caller);

    // Verify other user exists
    if (not (AccessControl.hasPermission(accessControlState, user2, #user))) {
      Runtime.trap("Other user must be registered");
    };

    let newMatch : Match = {
      user1 = caller;
      user2;
      compatibilityScore = compatibility;
    };
    matches.add(generateMatchId(), newMatch);
  };

  public query ({ caller }) func getCallerMatches() : async [Match] {
    validateUser(caller);

    matches.values().filter(
      func(match) {
        match.user1 == caller or match.user2 == caller
      }
    ).toArray();
  };

  public shared ({ caller }) func sendInterest(recipient : Principal) : async () {
    validateUser(caller);

    // Verify recipient exists
    if (not (AccessControl.hasPermission(accessControlState, recipient, #user))) {
      Runtime.trap("Recipient must be a registered user");
    };

    // Check if interest already sent
    let alreadySent = interests.values().any(
      func(existing) {
        existing.sender == caller and existing.recipient == recipient
      }
    );

    if (alreadySent) {
      Runtime.trap("Interest already sent to this user");
    };

    let interest : Interest = {
      sender = caller;
      recipient;
      status = "pending";
    };
    interests.add(generateInterestId(), interest);
  };

  public shared ({ caller }) func acceptInterest(interestId : Nat) : async () {
    validateUser(caller);

    switch (interests.get(interestId)) {
      case (null) { Runtime.trap("Interest not found") };
      case (?interest) {
        // Only the recipient can accept
        if (interest.recipient != caller) {
          Runtime.trap("Unauthorized: Only the recipient can accept this interest");
        };

        let updatedInterest = { interest with status = "accepted" };
        interests.add(interestId, updatedInterest);
      };
    };
  };

  public shared ({ caller }) func rejectInterest(interestId : Nat) : async () {
    validateUser(caller);

    switch (interests.get(interestId)) {
      case (null) { Runtime.trap("Interest not found") };
      case (?interest) {
        // Only the recipient can reject
        if (interest.recipient != caller) {
          Runtime.trap("Unauthorized: Only the recipient can reject this interest");
        };

        let updatedInterest = { interest with status = "rejected" };
        interests.add(interestId, updatedInterest);
      };
    };
  };

  public query ({ caller }) func getCallerReceivedInterests() : async [Interest] {
    validateUser(caller);

    interests.values().filter(
      func(interest) { interest.recipient == caller }
    ).toArray();
  };

  public query ({ caller }) func getCallerSentInterests() : async [Interest] {
    validateUser(caller);

    interests.values().filter(
      func(interest) { interest.sender == caller }
    ).toArray();
  };

  // Admin functions
  public shared ({ caller }) func deleteUser(user : Principal) : async () {
    validateAdmin(caller);

    userProfiles.remove(user);
    jobProfiles.remove(user);
    matrimonialProfiles.remove(user);
  };

  public query ({ caller }) func getAllUsers() : async [Principal] {
    validateAdmin(caller);

    userProfiles.keys().toArray();
  };

  func calculateJobMatchScore(_user : JobProfile, _job : JobListing) : Nat {
    // TODO: Use external AI here. Some PaintSQL validation needed which fields are hard/array
    // Compatibility score based on criteria:
    // 1. Location (25%)
    // 2. Salary Range (30%)
    // 3. Experience Level (30%)
    // 4. Job Type (15%)
    var score = 0;

    // Check location
    if (_user.location == _job.location) { score += 25 };

    // Salary range compatibility
    let jobSalary = (_job.salaryRange.0 + _job.salaryRange.1) / 2;
    let userSalary = (_user.minSalary + _user.maxSalary) / 2;
    let salaryDiff = if (jobSalary > userSalary) { jobSalary - userSalary } else {
      userSalary - jobSalary;
    };
    let salaryScore = if (salaryDiff <= 5000) { 30 } else if (salaryDiff <= 15000) {
      20;
    } else if (salaryDiff <= 25000) { 10 } else { 5 };
    score += salaryScore;

    // Experience level comparison
    score += switch (_job.experienceLevel) {
      case ("Entry Level") {
        // Entry level jobs score higher for 0-3 years experience
        if (_user.experience <= 3) {
          30;
        } else if (_user.experience <= 5) { 20 } else { 10 };
      };
      case ("Mid Level") {
        // Mid level jobs score higher for 4-7 years experience
        if (_user.experience >= 4 and _user.experience <= 7) {
          30;
        } else if (_user.experience >= 2 and _user.experience <= 9) {
          20;
        } else { 10 };
      };
      case ("Senior Level") {
        // Senior level jobs score higher for 8-15 years experience
        if (_user.experience >= 8 and _user.experience <= 15) {
          30;
        } else if (_user.experience >= 6 and _user.experience <= 18) {
          20;
        } else { 10 };
      };
      case ("Executive") {
        // Executive jobs score higher for 10+ years experience
        if (_user.experience >= 10) { 30 } else {
          let expDiff = if (9 >= _user.experience) { 9 - _user.experience } else {
            _user.experience - 9;
          };
          if (expDiff <= 2) { 20 } else if (expDiff <= 4) { 10 } else { 5 };
        };
      };
      case (_) { 15 }; // Default for other types
    };

    // Job type
    if (_job.jobType == "Full-Time") { score += 15 };
    score;
  };

  func calculateMatrimonialMatchScore(_user : MatrimonialProfile, _partner : MatrimonialProfile) : Nat {
    // TODO use AI here! See paintsql proposals.
    // Compatibility score based on criteria:
    // 1. Occupation (25%)
    // 2. Location (30%)
    // 3. Age Range (30%)
    // 4. Religion (15%)
    // 5. Interests (10%)
    var score = 0;

    // Check matching occupation
    if (_user.occupation == _partner.occupation) { score += 25 };
    if (_user.preferredLocation == _partner.preferredLocation) {
      score += 30;
    };
    let userMidAge = (_user.minAge + _user.maxAge) / 2;
    let partnerMidAge = (_partner.minAge + _partner.maxAge) / 2;
    let ageDiff = if (userMidAge > partnerMidAge) {
      userMidAge - partnerMidAge;
    } else { partnerMidAge - userMidAge };
    let ageScore = if (ageDiff <= 2) { 30 } else if (ageDiff <= 5) { 20 } else if (ageDiff <= 10) {
      10;
    } else { 5 };
    score += ageScore;

    // Religion compatibility
    if (_user.religion == _partner.religion) { score += 15 };

    // Interests (Simple check for now)
    // TODO: Calculate common hobbies/interests overlap
    // pref. Custom neuen datotypes in .psql definieren, dann mergen, dann überschneiden.

    score;
  };

  func getTestRecommendations() : AIRecommendationResult {
    let jobRecommendations : List.List<JobRecommendation> = List.empty<JobRecommendation>();
    jobRecommendations.add({
      job = {
        id = 1;
        company = "PaintSQL AG";
        experienceLevel = "Junior";
        jobType = "Full Time";
        salaryRange = (30_000, 40_000);
        category = "Developer";
        location = "Berlin";
        title = "Software Engineer";
      };
      matchScore = 85;
      reason = "Matched profession, salary, and location";
    });

    jobRecommendations.add({
      job = {
        id = 2;
        company = "Pigra Capital";
        experienceLevel = "Entry Level";
        jobType = "Freelance";
        salaryRange = (40_000, 60_000);
        category = "Business Analyst";
        location = "Berlin";
        title = "Business Analyst";
      };
      matchScore = 85;
      reason = "Matched profession, salary, and location";
    });

    let matrimonialRecommendations : List.List<MatrimonialRecommendation> = List.empty<MatrimonialRecommendation>();
    matrimonialRecommendations.add({
      profile = {
        name = "Anna Theresia";
        age = 18;
        religion = "Catholic";
        occupation = "Student";
        preferredLocation = "Hamburg";
        minAge = 15;
        maxAge = 25;
        profilePicture = null;
      };
      compatibilityScore = 98;
      reason = "Matched religion, profession, and location";
    });

    matrimonialRecommendations.add({
      profile = {
        name = "Doris";
        age = 21;
        religion = "Catholic";
        occupation = "Student";
        preferredLocation = "Germany";
        minAge = 18;
        maxAge = 32;
        profilePicture = null;
      };
      compatibilityScore = 75;
      reason = "Matched religion, and profession";
    });

    {
      recommendations = {
        jobs = jobRecommendations.toArray();
        matches = matrimonialRecommendations.toArray();
      };
      explanations = [
        "Test data if no resources available for AI. Should be replaced with AI-based matching.",
      ];
    };
  };

  public query ({ caller }) func getRecommendedJobsForCaller() : async [JobRecommendation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view recommendations");
    };

    // Extract test data from recommendations for now
    let testRecommendations = getTestRecommendations();
    testRecommendations.recommendations.jobs;
  };

  public query ({ caller }) func getRecommendedMatchesForCaller() : async [MatrimonialRecommendation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view recommendations");
    };

    // Extract test data from recommendations for now
    let testRecommendations = getTestRecommendations();
    testRecommendations.recommendations.matches;
  };

  // New endpoint to retrieve aggregated recommendations
  public query ({ caller }) func getRecommendationsForCaller() : async AIRecommendationResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view recommendations");
    };
    getTestRecommendations(); // Test data
  };
};
