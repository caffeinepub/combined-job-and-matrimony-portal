import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface MatrimonialRecommendation {
    compatibilityScore: bigint;
    profile: MatrimonialProfile;
    reason: string;
}
export interface JobProfile {
    resume?: ExternalBlob;
    name: string;
    maxSalary: bigint;
    education: string;
    profession: string;
    minSalary: bigint;
    experience: bigint;
    location: string;
}
export interface JobRecommendation {
    job: JobListing;
    matchScore: bigint;
    reason: string;
}
export interface JobListing {
    id: bigint;
    experienceLevel: string;
    title: string;
    jobType: string;
    company: string;
    category: string;
    salaryRange: [bigint, bigint];
    location: string;
}
export interface JobApplication {
    status: string;
    applicant: Principal;
    jobId: bigint;
    dateApplied: bigint;
}
export interface Recommendations {
    jobs: Array<JobRecommendation>;
    matches: Array<MatrimonialRecommendation>;
}
export interface Match {
    compatibilityScore: bigint;
    user1: Principal;
    user2: Principal;
}
export interface Interest {
    status: string;
    recipient: Principal;
    sender: Principal;
}
export interface Message {
    to: Principal;
    content: string;
    from: Principal;
    timestamp: bigint;
}
export interface MatrimonialProfile {
    age: bigint;
    occupation: string;
    name: string;
    minAge: bigint;
    preferredLocation: string;
    maxAge: bigint;
    religion: string;
    profilePicture?: ExternalBlob;
}
export interface AIRecommendationResult {
    recommendations: Recommendations;
    explanations: Array<string>;
}
export interface UserProfile {
    matrimonialProfile?: MatrimonialProfile;
    jobProfile?: JobProfile;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acceptInterest(interestId: bigint): Promise<void>;
    applyForJob(jobId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createJobListing(listing: JobListing): Promise<void>;
    createOrUpdateJobProfile(profile: JobProfile): Promise<void>;
    createOrUpdateMatrimonialProfile(profile: MatrimonialProfile): Promise<void>;
    deleteJobListing(jobId: bigint): Promise<void>;
    deleteUser(user: Principal): Promise<void>;
    getAllUsers(): Promise<Array<Principal>>;
    getCallerJobApplications(): Promise<Array<JobApplication>>;
    getCallerMatches(): Promise<Array<Match>>;
    getCallerMessages(otherUser: Principal): Promise<Array<Message>>;
    getCallerReceivedInterests(): Promise<Array<Interest>>;
    getCallerSentInterests(): Promise<Array<Interest>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getJobApplicationsByApplicant(applicant: Principal): Promise<Array<JobApplication>>;
    getJobApplicationsByJobId(jobId: bigint): Promise<Array<JobApplication>>;
    getJobListingById(jobId: bigint): Promise<JobListing>;
    getJobListings(): Promise<Array<JobListing>>;
    getJobProfile(user: Principal): Promise<JobProfile | null>;
    getMatrimonialProfile(user: Principal): Promise<MatrimonialProfile | null>;
    getMessages(user1: Principal, user2: Principal): Promise<Array<Message>>;
    getRecommendationsForCaller(): Promise<AIRecommendationResult>;
    getRecommendedJobsForCaller(): Promise<Array<JobRecommendation>>;
    getRecommendedMatchesForCaller(): Promise<Array<MatrimonialRecommendation>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    rejectInterest(interestId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveMatch(user2: Principal, compatibility: bigint): Promise<void>;
    sendInterest(recipient: Principal): Promise<void>;
    sendMessage(to: Principal, content: string): Promise<void>;
    updateApplicationStatus(applicationId: bigint, status: string): Promise<void>;
    updateJobListing(jobId: bigint, listing: JobListing): Promise<void>;
}
