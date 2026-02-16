import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Heart, User } from 'lucide-react';
import {
  useGetCallerUserProfile,
  useGetCallerJobApplications,
  useGetCallerReceivedInterests,
  useGetCallerSentInterests,
  useAcceptInterest,
  useRejectInterest,
} from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import type { PageView } from '../App';
import { Skeleton } from '@/components/ui/skeleton';
import JobProfileForm from '../components/JobProfileForm';
import MatrimonialProfileForm from '../components/MatrimonialProfileForm';
import RecommendationsSection from '../components/RecommendationsSection';

interface DashboardPageProps {
  onNavigate: (page: PageView) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: applications = [], isLoading: appsLoading } = useGetCallerJobApplications();
  const { data: receivedInterests = [], isLoading: receivedLoading } = useGetCallerReceivedInterests();
  const { data: sentInterests = [], isLoading: sentLoading } = useGetCallerSentInterests();
  const acceptInterest = useAcceptInterest();
  const rejectInterest = useRejectInterest();

  if (!identity) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Please login to access your dashboard</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Dashboard</h1>
          <p className="text-muted-foreground">Manage your profiles, applications, and connections</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="job-profile">Job Profile</TabsTrigger>
            <TabsTrigger value="matrimony-profile">Matrimony Profile</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="interests">Interests</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Job Applications</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{applications.length}</div>
                  <p className="text-xs text-muted-foreground">Total applications submitted</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Interests Received</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{receivedInterests.length}</div>
                  <p className="text-xs text-muted-foreground">People interested in you</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Interests Sent</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sentInterests.length}</div>
                  <p className="text-xs text-muted-foreground">Your sent interests</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {userProfile?.jobProfile && userProfile?.matrimonialProfile ? '100%' : '50%'}
                  </div>
                  <p className="text-xs text-muted-foreground">Profile completion</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2" onClick={() => onNavigate('jobs')}>
                    <Briefcase className="h-4 w-4" />
                    Browse Jobs
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2" onClick={() => onNavigate('matrimony')}>
                    <Heart className="h-4 w-4" />
                    Find Matches
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Completion</CardTitle>
                  <CardDescription>Complete your profiles to get better matches</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Job Profile</span>
                    <Badge variant={userProfile?.jobProfile ? 'default' : 'secondary'}>
                      {userProfile?.jobProfile ? 'Complete' : 'Incomplete'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Matrimonial Profile</span>
                    <Badge variant={userProfile?.matrimonialProfile ? 'default' : 'secondary'}>
                      {userProfile?.matrimonialProfile ? 'Complete' : 'Incomplete'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations">
            <RecommendationsSection onNavigate={onNavigate} />
          </TabsContent>

          {/* Job Profile Tab */}
          <TabsContent value="job-profile">
            <JobProfileForm />
          </TabsContent>

          {/* Matrimony Profile Tab */}
          <TabsContent value="matrimony-profile">
            <MatrimonialProfileForm />
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Job Applications</CardTitle>
                <CardDescription>Track the status of your job applications</CardDescription>
              </CardHeader>
              <CardContent>
                {appsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No applications yet</p>
                    <Button variant="outline" className="mt-4" onClick={() => onNavigate('jobs')}>
                      Browse Jobs
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applications.map((app, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Job ID: {app.jobId.toString()}</p>
                          <p className="text-sm text-muted-foreground">Applied on: {new Date().toLocaleDateString()}</p>
                        </div>
                        <Badge>{app.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interests Tab */}
          <TabsContent value="interests" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Received Interests</CardTitle>
                  <CardDescription>People who are interested in you</CardDescription>
                </CardHeader>
                <CardContent>
                  {receivedLoading ? (
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : receivedInterests.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No interests received yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {receivedInterests.map((interest, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">From: {interest.sender.toString().slice(0, 10)}...</p>
                            <Badge variant={interest.status === 'pending' ? 'secondary' : 'default'}>{interest.status}</Badge>
                          </div>
                          {interest.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() => acceptInterest.mutate(BigInt(index))}
                                disabled={acceptInterest.isPending}
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => rejectInterest.mutate(BigInt(index))}
                                disabled={rejectInterest.isPending}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sent Interests</CardTitle>
                  <CardDescription>Your sent interest requests</CardDescription>
                </CardHeader>
                <CardContent>
                  {sentLoading ? (
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : sentInterests.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No interests sent yet</p>
                      <Button variant="outline" className="mt-4" onClick={() => onNavigate('matrimony')}>
                        Find Matches
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sentInterests.map((interest, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <p className="text-sm">To: {interest.recipient.toString().slice(0, 10)}...</p>
                          <Badge variant={interest.status === 'pending' ? 'secondary' : 'default'}>{interest.status}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
