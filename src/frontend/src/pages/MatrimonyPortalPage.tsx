import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Briefcase, Search, Filter, User } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSendInterest, useGetCallerSentInterests } from '../hooks/useQueries';

export default function MatrimonyPortalPage() {
  const { identity } = useInternetIdentity();
  const { data: sentInterests = [] } = useGetCallerSentInterests();
  const sendInterest = useSendInterest();

  const [searchTerm, setSearchTerm] = useState('');

  const isAuthenticated = !!identity;

  // Mock profiles for demonstration (in real app, fetch from backend)
  const profiles = [
    {
      principal: 'sample-principal-1',
      name: 'Sample Profile 1',
      age: 28,
      occupation: 'Software Engineer',
      location: 'New York',
      religion: 'Hindu',
    },
    {
      principal: 'sample-principal-2',
      name: 'Sample Profile 2',
      age: 26,
      occupation: 'Doctor',
      location: 'Los Angeles',
      religion: 'Christian',
    },
  ];

  const filteredProfiles = profiles.filter((profile) =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasSentInterest = (principal: string) =>
    sentInterests.some((interest) => interest.recipient.toString() === principal);

  return (
    <div className="container py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl flex items-center gap-2">
            <Heart className="h-8 w-8 text-rose-600 fill-rose-600" />
            Matrimony Portal
          </h1>
          <p className="text-muted-foreground">Find your perfect life partner</p>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search Profiles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Profiles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {filteredProfiles.length} {filteredProfiles.length === 1 ? 'Profile' : 'Profiles'} Found
            </h2>
          </div>

          {!isAuthenticated ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Please login to view matrimonial profiles</p>
                <Button>Login to Continue</Button>
              </CardContent>
            </Card>
          ) : filteredProfiles.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No profiles found matching your criteria</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProfiles.map((profile) => (
                <Card key={profile.principal} className="hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="/assets/generated/profile-placeholder.dim_200x200.jpg" />
                        <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{profile.name}</CardTitle>
                        <CardDescription>{profile.age} years</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      {profile.occupation}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{profile.religion}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      View Profile
                    </Button>
                    <Button
                      className="flex-1 gap-2"
                      disabled={hasSentInterest(profile.principal) || sendInterest.isPending}
                    >
                      <Heart className="h-4 w-4" />
                      {hasSentInterest(profile.principal) ? 'Interest Sent' : 'Send Interest'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
