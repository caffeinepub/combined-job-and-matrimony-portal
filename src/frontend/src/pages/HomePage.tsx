import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Heart, Users, Shield, TrendingUp, MessageCircle } from 'lucide-react';
import type { PageView } from '../App';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface HomePageProps {
  onNavigate: (page: PageView) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const features = [
    {
      icon: Briefcase,
      title: 'Job Portal',
      description: 'Find your dream job with advanced filters and personalized recommendations',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: Heart,
      title: 'Matrimony Portal',
      description: 'Discover compatible life partners based on your preferences',
      color: 'text-rose-600 dark:text-rose-400',
    },
    {
      icon: Users,
      title: 'Dual Profiles',
      description: 'Maintain separate job and matrimonial profiles in one account',
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      icon: MessageCircle,
      title: 'Private Messaging',
      description: 'Connect with matches and employers through secure messaging',
      color: 'text-green-600 dark:text-green-400',
    },
    {
      icon: TrendingUp,
      title: 'Smart Recommendations',
      description: 'AI-powered suggestions for jobs and matrimonial matches',
      color: 'text-orange-600 dark:text-orange-400',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with Internet Identity authentication',
      color: 'text-indigo-600 dark:text-indigo-400',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container py-20 md:py-32">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Your Journey to{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Success & Happiness
                </span>
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                ConnectHub combines job search and matrimonial services in one powerful platform. Find your dream career and life
                partner, all in one place.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" onClick={() => onNavigate('jobs')} className="gap-2">
                  <Briefcase className="h-5 w-5" />
                  Explore Jobs
                </Button>
                <Button size="lg" variant="outline" onClick={() => onNavigate('matrimony')} className="gap-2">
                  <Heart className="h-5 w-5" />
                  Find Matches
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/hero-image.dim_1200x600.jpg"
                alt="ConnectHub Platform"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16 md:py-24">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Why Choose ConnectHub?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive platform designed to help you achieve both professional and personal milestones
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Icon className={`h-12 w-12 mb-2 ${feature.color}`} />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container py-16 md:py-24">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
            <p className="text-lg opacity-90">
              {isAuthenticated
                ? 'Complete your profile and start exploring opportunities today!'
                : 'Join thousands of users who have found success with ConnectHub'}
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'jobs')}
              className="gap-2"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
