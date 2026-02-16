import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetCallerUserProfile, useCreateOrUpdateJobProfile } from '../hooks/useQueries';
import type { JobProfile } from '../backend';
import { FileText } from 'lucide-react';

export default function JobProfileForm() {
  const { data: userProfile } = useGetCallerUserProfile();
  const updateProfile = useCreateOrUpdateJobProfile();

  const [formData, setFormData] = useState({
    name: '',
    education: '',
    location: '',
    profession: '',
    experience: '',
    minSalary: '',
    maxSalary: '',
  });

  useEffect(() => {
    if (userProfile?.jobProfile) {
      const jp = userProfile.jobProfile;
      setFormData({
        name: jp.name,
        education: jp.education,
        location: jp.location,
        profession: jp.profession,
        experience: jp.experience.toString(),
        minSalary: jp.minSalary.toString(),
        maxSalary: jp.maxSalary.toString(),
      });
    }
  }, [userProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const profile: JobProfile = {
      name: formData.name,
      education: formData.education,
      location: formData.location,
      profession: formData.profession,
      experience: BigInt(formData.experience || 0),
      minSalary: BigInt(formData.minSalary || 0),
      maxSalary: BigInt(formData.maxSalary || 0),
      resume: undefined,
    };

    updateProfile.mutate(profile);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Job Profile
        </CardTitle>
        <CardDescription>Manage your professional information and career preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profession">Profession *</Label>
              <Input
                id="profession"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                placeholder="e.g. Software Engineer"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Input
                id="education"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                placeholder="e.g. Bachelor's in Computer Science"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. New York, NY"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minSalary">Minimum Expected Salary</Label>
              <Input
                id="minSalary"
                type="number"
                value={formData.minSalary}
                onChange={(e) => setFormData({ ...formData, minSalary: e.target.value })}
                placeholder="50000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxSalary">Maximum Expected Salary</Label>
              <Input
                id="maxSalary"
                type="number"
                value={formData.maxSalary}
                onChange={(e) => setFormData({ ...formData, maxSalary: e.target.value })}
                placeholder="100000"
              />
            </div>
          </div>
          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? 'Saving...' : 'Save Job Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
