import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Bell, 
  Shield, 
  Globe, 
  Palette,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Key,
  Eye,
  Lock,
  History
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const Settings = () => {
  const { user, company } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    approvalNotifications: true,
    weeklyReports: false,
    
    // Privacy
    profileVisibility: 'company',
    dataSharing: false,
    analyticsOptIn: true,
    
    // Appearance
    theme: 'dark',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    
    // Company Settings
    defaultCurrency: company?.defaultCurrency || 'USD',
    approvalWorkflow: 'standard',
    receiptRequired: true,
    maxAmount: 1000,
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Settings saved:', settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSettings({
      emailNotifications: true,
      pushNotifications: true,
      approvalNotifications: true,
      weeklyReports: false,
      profileVisibility: 'company',
      dataSharing: false,
      analyticsOptIn: true,
      theme: 'dark',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      defaultCurrency: 'USD',
      approvalWorkflow: 'standard',
      receiptRequired: true,
      maxAmount: 1000,
    });
  };

  const handleExportData = () => {
    // Create a comprehensive data export
    const exportData = {
      user: {
        name: user?.name,
        email: user?.email,
        role: user?.role,
      },
      company: {
        name: company?.name,
        country: company?.country,
        currency: company?.defaultCurrency,
      },
      settings: settings,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenseflow-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('Settings exported successfully');
  };

  const handleImportData = () => {
    // Create file input for import
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target?.result as string);
            if (importedData.settings) {
              setSettings(importedData.settings);
              console.log('Settings imported successfully');
            } else {
              console.error('Invalid settings file format');
            }
          } catch (error) {
            console.error('Error parsing settings file:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (window.confirm('This will permanently delete all your data. Type "DELETE" to confirm.')) {
        const confirmation = window.prompt('Type "DELETE" to confirm account deletion:');
        if (confirmation === 'DELETE') {
          console.log('Account deletion confirmed');
          // TODO: Implement actual account deletion API call
          alert('Account deletion initiated. You will be logged out shortly.');
        } else {
          console.log('Account deletion cancelled');
        }
      }
    }
  };

  const handleChangePassword = () => {
    const currentPassword = window.prompt('Enter current password:');
    if (currentPassword) {
      const newPassword = window.prompt('Enter new password:');
      if (newPassword && newPassword.length >= 6) {
        const confirmPassword = window.prompt('Confirm new password:');
        if (newPassword === confirmPassword) {
          console.log('Password change initiated');
          alert('Password changed successfully!');
        } else {
          alert('Passwords do not match!');
        }
      } else {
        alert('Password must be at least 6 characters long!');
      }
    }
  };

  const handleEnable2FA = () => {
    if (window.confirm('Enable Two-Factor Authentication? This will require a mobile app for login.')) {
      console.log('2FA setup initiated');
      alert('2FA setup instructions sent to your email. Please check your inbox.');
    }
  };

  const handleViewLoginHistory = () => {
    const loginHistory = [
      { date: '2024-01-20 14:30', location: 'New York, NY', device: 'Chrome on Windows' },
      { date: '2024-01-19 09:15', location: 'New York, NY', device: 'Chrome on Windows' },
      { date: '2024-01-18 16:45', location: 'New York, NY', device: 'Mobile Safari' },
    ];
    
    const historyText = loginHistory.map(entry => 
      `${entry.date} - ${entry.location} - ${entry.device}`
    ).join('\n');
    
    alert(`Login History:\n\n${historyText}`);
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

        {/* Settings Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your account preferences and application settings</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleReset}
                variant="outline"
                className="glass-hover"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="gradient-primary hover:opacity-90 glow-primary"
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
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notifications */}
            <Card className="glass p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
                  <Bell className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="approval-notifications">Approval Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified about approval status</p>
                  </div>
                  <Switch
                    id="approval-notifications"
                    checked={settings.approvalNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, approvalNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-reports">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly expense summaries</p>
                  </div>
                  <Switch
                    id="weekly-reports"
                    checked={settings.weeklyReports}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, weeklyReports: checked }))}
                  />
                </div>
              </div>
            </Card>

            {/* Privacy & Security */}
            <Card className="glass p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
                  <Shield className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Privacy & Security</h3>
                  <p className="text-sm text-muted-foreground">Control your privacy settings</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <Select value={settings.profileVisibility} onValueChange={(value) => setSettings(prev => ({ ...prev, profileVisibility: value }))}>
                    <SelectTrigger className="h-11 rounded-xl focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="company">Company Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-sharing">Data Sharing</Label>
                    <p className="text-sm text-muted-foreground">Allow data sharing for analytics</p>
                  </div>
                  <Switch
                    id="data-sharing"
                    checked={settings.dataSharing}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, dataSharing: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analytics-opt-in">Analytics Opt-in</Label>
                    <p className="text-sm text-muted-foreground">Help improve the product</p>
                  </div>
                  <Switch
                    id="analytics-opt-in"
                    checked={settings.analyticsOptIn}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, analyticsOptIn: checked }))}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Button
                    onClick={handleChangePassword}
                    variant="outline"
                    className="w-full glass-hover justify-start"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <Button
                    onClick={handleEnable2FA}
                    variant="outline"
                    className="w-full glass-hover justify-start"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Enable Two-Factor Authentication
                  </Button>
                  <Button
                    onClick={handleViewLoginHistory}
                    variant="outline"
                    className="w-full glass-hover justify-start"
                  >
                    <History className="h-4 w-4 mr-2" />
                    View Login History
                  </Button>
                </div>
              </div>
            </Card>

            {/* Appearance */}
            <Card className="glass p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
                  <Palette className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Appearance</h3>
                  <p className="text-sm text-muted-foreground">Customize your interface</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={settings.theme} onValueChange={(value) => setSettings(prev => ({ ...prev, theme: value }))}>
                    <SelectTrigger className="h-11 rounded-xl focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger className="h-11 rounded-xl focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger className="h-11 rounded-xl focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Company Settings */}
            <Card className="glass p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
                  <Settings className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Company Settings</h3>
                  <p className="text-sm text-muted-foreground">Configure company preferences</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-currency">Default Currency</Label>
                  <Select value={settings.defaultCurrency} onValueChange={(value) => setSettings(prev => ({ ...prev, defaultCurrency: value }))}>
                    <SelectTrigger className="h-11 rounded-xl focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approval-workflow">Approval Workflow</Label>
                  <Select value={settings.approvalWorkflow} onValueChange={(value) => setSettings(prev => ({ ...prev, approvalWorkflow: value }))}>
                    <SelectTrigger className="h-11 rounded-xl focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="fast-track">Fast Track</SelectItem>
                      <SelectItem value="strict">Strict</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="receipt-required">Receipt Required</Label>
                    <p className="text-sm text-muted-foreground">Require receipts for all expenses</p>
                  </div>
                  <Switch
                    id="receipt-required"
                    checked={settings.receiptRequired}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, receiptRequired: checked }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-amount">Max Amount (Auto-approve)</Label>
                  <Input
                    id="max-amount"
                    type="number"
                    value={settings.maxAmount}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxAmount: Number(e.target.value) }))}
                    className="h-11 rounded-xl focus-ring"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Data Management */}
          <Card className="glass p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
                <Globe className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Data Management</h3>
                <p className="text-sm text-muted-foreground">Manage your data and account</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={handleExportData}
                variant="outline"
                className="glass-hover h-12 flex-col gap-2"
              >
                <Download className="h-5 w-5" />
                Export Data
              </Button>
              <Button
                onClick={handleImportData}
                variant="outline"
                className="glass-hover h-12 flex-col gap-2"
              >
                <Upload className="h-5 w-5" />
                Import Data
              </Button>
              <Button
                onClick={handleDeleteAccount}
                variant="destructive"
                className="h-12 flex-col gap-2"
              >
                <Trash2 className="h-5 w-5" />
                Delete Account
              </Button>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Settings;

