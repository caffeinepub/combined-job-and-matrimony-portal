import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Briefcase, Heart, MapPin, DollarSign, TrendingUp } from 'lucide-react';
import { useGetRecommendedJobs, useGetRecommendedMatches, useApplyForJob } from '../hooks/useQueries';
import type { PageView } from '../App';

interface RecommendationsSectionProps {
  onNavigate: (page: PageView) => void;
}

export default function RecommendationsSection({ onNavigate }: RecommendationsSectionProps) {
  const { data: jobRecommendations = [], isLoading: jobsLoading } = useGetRecommendedJobs();
  const { data: matchRecommendations = [], isLoading: matchesLoading } = useGetRecommendedMatches();
  const applyForJob = useApplyForJob();

  const topJobs = jobRecommendations.slice(0, 5);
  const topMatches = matchRecommendations.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <img src="/assets/generated/ai-brain-icon-transparent.dim_64x64.png" alt="AI" className="h-8 w-8" />
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Recommendations</h2>
          <p className="text-muted-foreground">Personalized suggestions powered by AI</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Job Recommendations */}
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <CardTitle>Top Job Matches</CardTitle>
              </div>
              <img src="/assets/generated/recommendation-badge-transparent.dim_64x64.png" alt="Recommended" className="h-6 w-6" />
            </div>
            <CardDescription>AI-powered job recommendations based on your profile</CardDescription>
          </CardHeader>
          <CardContent>
            {jobsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : topJobs.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">No recommendations yet</p>
                <p className="text-sm text-muted-foreground mb-4">Complete your job profile to get personalized recommendations</p>
                <Button variant="outline" size="sm" onClick={() => onNavigate('dashboard')}>
                  Update Profile
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {topJobs.map((recommendation, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3 hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-1">
                        <h3 className="font-semibold">{recommendation.job.title}</h3>
                        <p className="text-sm text-muted-foreground">{recommendation.job.company}</p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {Number(recommendation.matchScore)}% Match
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {recommendation.job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        ${Number(recommendation.job.salaryRange[0]).toLocaleString()} - ${Number(recommendation.job.salaryRange[1]).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-2 bg-primary/5 rounded text-sm">
                      <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-muted-foreground italic">{recommendation.reason}</p>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => applyForJob.mutate(recommendation.job.id)}
                      disabled={applyForJob.isPending}
                    >
                      {applyForJob.isPending ? 'Applying...' : 'Apply Now'}
                    </Button>
                  </div>
                ))}
                
                {topJobs.length > 0 && (
                  <Button variant="outline" className="w-full" onClick={() => onNavigate('jobs')}>
                    View All Jobs
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Matrimonial Recommendations */}
        <Card className="border-accent/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-accent" />
                <CardTitle>Top Match Suggestions</CardTitle>
              </div>
              <img src="/assets/generated/recommendation-badge-transparent.dim_64x64.png" alt="Recommended" className="h-6 w-6" />
            </div>
            <CardDescription>AI-powered matrimonial matches based on compatibility</CardDescription>
          </CardHeader>
          <CardContent>
            {matchesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : topMatches.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">No recommendations yet</p>
                <p className="text-sm text-muted-foreground mb-4">Complete your matrimonial profile to get personalized matches</p>
                <Button variant="outline" size="sm" onClick={() => onNavigate('dashboard')}>
                  Update Profile
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {topMatches.map((recommendation, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3 hover:border-accent/50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-1">
                        <h3 className="font-semibold">{recommendation.profile.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {Number(recommendation.profile.age)} years • {recommendation.profile.occupation}
                        </p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        <Heart className="h-3 w-3 mr-1 fill-current" />
                        {Number(recommendation.compatibilityScore)}% Compatible
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {recommendation.profile.preferredLocation}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {recommendation.profile.religion}
                      </Badge>
                    </div>

                    <div className="flex items-start gap-2 p-2 bg-accent/5 rounded text-sm">
                      <Sparkles className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <p className="text-muted-foreground italic">{recommendation.reason}</p>
                    </div>

                    <Button 
                      size="sm" 
                      variant="outline"
                      className="w-full"
                      onClick={() => onNavigate('matrimony')}
                    >
                      View Profile
                    </Button>
                  </div>
                ))}
                
                {topMatches.length > 0 && (
                  <Button variant="outline" className="w-full" onClick={() => onNavigate('matrimony')}>
                    View All Matches
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
