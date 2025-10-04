import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Building, 
  MapPin, 
  Calendar,
  Shield,
  Edit,
  Save,
  X,
  Camera
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import AdminDetails from '@/components/AdminDetails';

const Profile = () => {
  const { user, company } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    company: company?.name || '',
    country: company?.country || '',
    currency: company?.defaultCurrency || '',
    joinDate: '2024-01-15', // Mock data
    lastLogin: '2024-01-20 14:30', // Mock data
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || '',
      company: company?.name || '',
      country: company?.country || '',
      currency: company?.defaultCurrency || '',
      joinDate: '2024-01-15',
      lastLogin: '2024-01-20 14:30',
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Profile Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Profile</h1>
              <p className="text-muted-foreground mt-1">Manage your account information and preferences</p>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
              className={isEditing ? "glass-hover" : "gradient-primary hover:opacity-90 glow-primary"}
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="glass p-6 rounded-2xl">
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src="" alt={profileData.name} />
                    <AvatarFallback className="gradient-primary text-primary-foreground text-2xl font-bold">
                      {profileData.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full gradient-primary"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold">{profileData.name}</h2>
                  <p className="text-muted-foreground">{profileData.email}</p>
                  <Badge 
                    variant="outline" 
                    className={`mt-2 ${
                      profileData.role === 'Admin' ? 'status-approved' :
                      profileData.role === 'Manager' ? 'status-pending' :
                      'status-rejected'
                    }`}
                  >
                    {profileData.role}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Company:</span>
                    <span className="font-medium">{profileData.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Joined:</span>
                    <span className="font-medium">{profileData.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Last Login:</span>
                    <span className="font-medium">{profileData.lastLogin}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card className="glass p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Personal Information</h3>
                    <p className="text-sm text-muted-foreground">Update your personal details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      className="h-11 rounded-xl focus-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="h-11 rounded-xl focus-ring"
                    />
                  </div>
                </div>
              </Card>

              {/* Company Information */}
              <Card className="glass p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
                    <Building className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Company Information</h3>
                    <p className="text-sm text-muted-foreground">Your company details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      value={profileData.company}
                      onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                      disabled={!isEditing}
                      className="h-11 rounded-xl focus-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={profileData.country}
                      onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                      disabled={!isEditing}
                      className="h-11 rounded-xl focus-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Input
                      id="currency"
                      value={profileData.currency}
                      onChange={(e) => setProfileData(prev => ({ ...prev, currency: e.target.value }))}
                      disabled={!isEditing}
                      className="h-11 rounded-xl focus-ring"
                    />
                  </div>
                </div>
              </Card>

              {/* Security Settings */}
              <Card className="glass p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
                    <Shield className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Security</h3>
                    <p className="text-sm text-muted-foreground">Manage your account security</p>
                  </div>
                </div>

              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full glass-hover"
                  onClick={() => {
                    const currentPassword = window.prompt('Enter current password:');
                    if (currentPassword) {
                      const newPassword = window.prompt('Enter new password:');
                      if (newPassword && newPassword.length >= 6) {
                        const confirmPassword = window.prompt('Confirm new password:');
                        if (newPassword === confirmPassword) {
                          alert('Password changed successfully!');
                        } else {
                          alert('Passwords do not match!');
                        }
                      } else {
                        alert('Password must be at least 6 characters long!');
                      }
                    }
                  }}
                >
                  Change Password
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full glass-hover"
                  onClick={() => {
                    if (window.confirm('Enable Two-Factor Authentication? This will require a mobile app for login.')) {
                      alert('2FA setup instructions sent to your email. Please check your inbox.');
                    }
                  }}
                >
                  Enable Two-Factor Authentication
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full glass-hover"
                  onClick={() => {
                    const loginHistory = [
                      '2024-01-20 14:30 - New York, NY - Chrome on Windows',
                      '2024-01-19 09:15 - New York, NY - Chrome on Windows',
                      '2024-01-18 16:45 - New York, NY - Mobile Safari',
                    ];
                    alert(`Login History:\n\n${loginHistory.join('\n')}`);
                  }}
                >
                  View Login History
                </Button>
              </div>
              </Card>

              {/* Save Button */}
              {isEditing && (
                <div className="flex gap-3">
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="gradient-primary hover:opacity-90 glow-primary flex-1"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="glass-hover flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Admin Details */}
          <AdminDetails />
        </main>
      </div>
    </div>
  );
};

export default Profile;
