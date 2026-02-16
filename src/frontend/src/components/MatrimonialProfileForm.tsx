import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetCallerUserProfile, useCreateOrUpdateMatrimonialProfile } from '../hooks/useQueries';
import type { MatrimonialProfile } from '../backend';
import { Heart } from 'lucide-react';

export default function MatrimonialProfileForm() {
  const { data: userProfile } = useGetCallerUserProfile();
  const updateProfile = useCreateOrUpdateMatrimonialProfile();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    religion: '',
    occupation: '',
    preferredLocation: '',
    minAge: '',
    maxAge: '',
  });

  useEffect(() => {
    if (userProfile?.matrimonialProfile) {
      const mp = userProfile.matrimonialProfile;
      setFormData({
        name: mp.name,
        age: mp.age.toString(),
        religion: mp.religion,
        occupation: mp.occupation,
        preferredLocation: mp.preferredLocation,
        minAge: mp.minAge.toString(),
        maxAge: mp.maxAge.toString(),
      });
    }
  }, [userProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const profile: MatrimonialProfile = {
      name: formData.name,
      age: BigInt(formData.age || 0),
      religion: formData.religion,
      occupation: formData.occupation,
      preferredLocation: formData.preferredLocation,
      minAge: BigInt(formData.minAge || 0),
      maxAge: BigInt(formData.maxAge || 0),
      profilePicture: undefined,
    };

    updateProfile.mutate(profile);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-rose-600 fill-rose-600" />
          Matrimonial Profile
        </CardTitle>
        <CardDescription>Manage your personal information and partner preferences</CardDescription>
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
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="religion">Religion</Label>
              <Input
                id="religion"
                value={formData.religion}
                onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                placeholder="e.g. Hindu, Christian, Muslim"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="e.g. Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredLocation">Preferred Location</Label>
              <Input
                id="preferredLocation"
                value={formData.preferredLocation}
                onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                placeholder="e.g. New York, NY"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minAge">Partner Min Age</Label>
              <Input
                id="minAge"
                type="number"
                value={formData.minAge}
                onChange={(e) => setFormData({ ...formData, minAge: e.target.value })}
                placeholder="25"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAge">Partner Max Age</Label>
              <Input
                id="maxAge"
                type="number"
                value={formData.maxAge}
                onChange={(e) => setFormData({ ...formData, maxAge: e.target.value })}
                placeholder="35"
              />
            </div>
          </div>
          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? 'Saving...' : 'Save Matrimonial Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
