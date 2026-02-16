import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Users, Briefcase, Trash2 } from 'lucide-react';
import { useIsCallerAdmin, useGetAllUsers, useGetJobListings, useCreateJobListing, useDeleteJobListing } from '../hooks/useQueries';
import type { JobListing } from '../backend';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: users = [] } = useGetAllUsers();
  const { data: jobs = [] } = useGetJobListings();
  const createJob = useCreateJobListing();
  const deleteJob = useDeleteJobListing();

  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    minSalary: '',
    maxSalary: '',
    experienceLevel: '',
    jobType: '',
    category: '',
  });

  if (adminLoading) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newJob.title || !newJob.company || !newJob.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    const jobListing: JobListing = {
      id: BigInt(0), // Will be set by backend
      title: newJob.title,
      company: newJob.company,
      location: newJob.location,
      salaryRange: [BigInt(newJob.minSalary || 0), BigInt(newJob.maxSalary || 0)],
      experienceLevel: newJob.experienceLevel || 'Entry Level',
      jobType: newJob.jobType || 'Full-time',
      category: newJob.category || 'General',
    };

    createJob.mutate(jobListing, {
      onSuccess: () => {
        setNewJob({
          title: '',
          company: '',
          location: '',
          minSalary: '',
          maxSalary: '',
          experienceLevel: '',
          jobType: '',
          category: '',
        });
      },
    });
  };

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage users, jobs, and platform content</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="jobs">Job Listings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-xs text-muted-foreground">Registered users</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Job Listings</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{jobs.length}</div>
                  <p className="text-xs text-muted-foreground">Active job postings</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Platform Status</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Active</div>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage registered users</CardDescription>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No users registered yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {users.map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">User {index + 1}</p>
                          <p className="text-sm text-muted-foreground">{user.toString()}</p>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Job Listing</CardTitle>
                <CardDescription>Add a new job posting to the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateJob} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title *</Label>
                      <Input
                        id="title"
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        placeholder="e.g. Senior Software Engineer"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        value={newJob.company}
                        onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                        placeholder="e.g. Tech Corp"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                        placeholder="e.g. New York, NY"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newJob.category}
                        onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                        placeholder="e.g. Technology"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minSalary">Min Salary</Label>
                      <Input
                        id="minSalary"
                        type="number"
                        value={newJob.minSalary}
                        onChange={(e) => setNewJob({ ...newJob, minSalary: e.target.value })}
                        placeholder="50000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxSalary">Max Salary</Label>
                      <Input
                        id="maxSalary"
                        type="number"
                        value={newJob.maxSalary}
                        onChange={(e) => setNewJob({ ...newJob, maxSalary: e.target.value })}
                        placeholder="100000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experienceLevel">Experience Level</Label>
                      <Input
                        id="experienceLevel"
                        value={newJob.experienceLevel}
                        onChange={(e) => setNewJob({ ...newJob, experienceLevel: e.target.value })}
                        placeholder="e.g. Mid-Level"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobType">Job Type</Label>
                      <Input
                        id="jobType"
                        value={newJob.jobType}
                        onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })}
                        placeholder="e.g. Full-time"
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={createJob.isPending}>
                    {createJob.isPending ? 'Creating...' : 'Create Job Listing'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Job Listings</CardTitle>
                <CardDescription>Manage current job postings</CardDescription>
              </CardHeader>
              <CardContent>
                {jobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No job listings yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {jobs.map((job) => (
                      <div key={job.id.toString()} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{job.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {job.company} • {job.location}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteJob.mutate(job.id)}
                          disabled={deleteJob.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
