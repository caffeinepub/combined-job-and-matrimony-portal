import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, JobProfile, MatrimonialProfile, JobListing, JobApplication, Message, Match, Interest, JobRecommendation, MatrimonialRecommendation } from '../backend';
import { Principal } from '@icp-sdk/core/principal';
import { toast } from 'sonner';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save profile: ${error.message}`);
    },
  });
}

export function useCreateOrUpdateJobProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: JobProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrUpdateJobProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['recommendedJobs'] });
      toast.success('Job profile updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update job profile: ${error.message}`);
    },
  });
}

export function useCreateOrUpdateMatrimonialProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: MatrimonialProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrUpdateMatrimonialProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['recommendedMatches'] });
      toast.success('Matrimonial profile updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update matrimonial profile: ${error.message}`);
    },
  });
}

// Job Listings Queries
export function useGetJobListings() {
  const { actor, isFetching } = useActor();

  return useQuery<JobListing[]>({
    queryKey: ['jobListings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getJobListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateJobListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listing: JobListing) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createJobListing(listing);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobListings'] });
      queryClient.invalidateQueries({ queryKey: ['recommendedJobs'] });
      toast.success('Job listing created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create job listing: ${error.message}`);
    },
  });
}

export function useDeleteJobListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteJobListing(jobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobListings'] });
      queryClient.invalidateQueries({ queryKey: ['recommendedJobs'] });
      toast.success('Job listing deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete job listing: ${error.message}`);
    },
  });
}

// Job Applications
export function useGetCallerJobApplications() {
  const { actor, isFetching } = useActor();

  return useQuery<JobApplication[]>({
    queryKey: ['callerJobApplications'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerJobApplications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApplyForJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.applyForJob(jobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerJobApplications'] });
      toast.success('Application submitted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to apply: ${error.message}`);
    },
  });
}

// Messages
export function useGetCallerMessages(otherUser: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['callerMessages', otherUser?.toString()],
    queryFn: async () => {
      if (!actor || !otherUser) return [];
      return actor.getCallerMessages(otherUser);
    },
    enabled: !!actor && !isFetching && !!otherUser,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ to, content }: { to: Principal; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(to, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerMessages'] });
      toast.success('Message sent');
    },
    onError: (error: Error) => {
      toast.error(`Failed to send message: ${error.message}`);
    },
  });
}

// Matches
export function useGetCallerMatches() {
  const { actor, isFetching } = useActor();

  return useQuery<Match[]>({
    queryKey: ['callerMatches'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerMatches();
    },
    enabled: !!actor && !isFetching,
  });
}

// Interests
export function useGetCallerReceivedInterests() {
  const { actor, isFetching } = useActor();

  return useQuery<Interest[]>({
    queryKey: ['callerReceivedInterests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerReceivedInterests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerSentInterests() {
  const { actor, isFetching } = useActor();

  return useQuery<Interest[]>({
    queryKey: ['callerSentInterests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerSentInterests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSendInterest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recipient: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendInterest(recipient);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerSentInterests'] });
      toast.success('Interest sent successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to send interest: ${error.message}`);
    },
  });
}

export function useAcceptInterest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (interestId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.acceptInterest(interestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerReceivedInterests'] });
      toast.success('Interest accepted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to accept interest: ${error.message}`);
    },
  });
}

export function useRejectInterest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (interestId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectInterest(interestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerReceivedInterests'] });
      toast.success('Interest rejected');
    },
    onError: (error: Error) => {
      toast.error(`Failed to reject interest: ${error.message}`);
    },
  });
}

// Admin Queries
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<Principal[]>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

// AI Recommendations Queries
export function useGetRecommendedJobs() {
  const { actor, isFetching } = useActor();

  return useQuery<JobRecommendation[]>({
    queryKey: ['recommendedJobs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecommendedJobsForCaller();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRecommendedMatches() {
  const { actor, isFetching } = useActor();

  return useQuery<MatrimonialRecommendation[]>({
    queryKey: ['recommendedMatches'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecommendedMatchesForCaller();
    },
    enabled: !!actor && !isFetching,
  });
}
