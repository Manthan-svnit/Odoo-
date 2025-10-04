import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
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
  History,
  User,
  Building,
  CreditCard,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  CheckCircle,
  AlertTriangle,
  Mail,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import AdminDetails from '@/components/AdminDetails';

const Settings = () => {
  const { user, company } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showLoginHistoryModal, setShowLoginHistoryModal] = useState(false);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
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
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "New password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast({
        title: "Success",
        description: "Password has been changed successfully.",
      });
    }, 2000);
  };

  const handleEnable2FA = () => {
    setShow2FAModal(true);
  };

  const handle2FASetup = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShow2FAModal(false);
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been enabled successfully.",
      });
    }, 2000);
  };

  const handleViewLoginHistory = () => {
    setShowLoginHistoryModal(true);
  };

  const handleViewSessions = () => {
    setShowSessionsModal(true);
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

          {/* Settings Tabs */}
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="general">
                <SettingsIcon className="h-4 w-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <Palette className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="data">
                <Globe className="h-4 w-4 mr-2" />
                Data
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Settings */}
                <Card className="glass p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
                      <User className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Profile Settings</h3>
                      <p className="text-sm text-muted-foreground">Manage your personal information</p>
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
                  </div>
                </Card>

                {/* Company Settings */}
                <Card className="glass p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
                      <Building className="h-5 w-5 text-primary-foreground" />
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
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="glass p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
                    <Bell className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Notification Preferences</h3>
                    <p className="text-sm text-muted-foreground">Choose how you want to be notified</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Email Notifications */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Email Notifications</h4>
                    </div>
                    <div className="space-y-4 pl-7">
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
                  </div>

                  <Separator />

                  {/* Push Notifications */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-secondary" />
                      <h4 className="font-medium">Push Notifications</h4>
                    </div>
                    <div className="space-y-4 pl-7">
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
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <Card className="glass p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
                    <Shield className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Security & Privacy</h3>
                    <p className="text-sm text-muted-foreground">Manage your account security</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Security Actions */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Security Actions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        onClick={handleChangePassword}
                        variant="outline"
                        className="glass-hover h-12 justify-start"
                      >
                        <Key className="h-4 w-4 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Change Password</div>
                          <div className="text-xs text-muted-foreground">Update your password</div>
                        </div>
                      </Button>
                      <Button
                        onClick={handleEnable2FA}
                        variant="outline"
                        className="glass-hover h-12 justify-start"
                      >
                        <Shield className="h-4 w-4 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Enable 2FA</div>
                          <div className="text-xs text-muted-foreground">Two-factor authentication</div>
                        </div>
                      </Button>
                      <Button
                        onClick={handleViewLoginHistory}
                        variant="outline"
                        className="glass-hover h-12 justify-start"
                      >
                        <History className="h-4 w-4 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Login History</div>
                          <div className="text-xs text-muted-foreground">View recent logins</div>
                        </div>
                      </Button>
                      <Button
                        onClick={handleViewSessions}
                        variant="outline"
                        className="glass-hover h-12 justify-start"
                      >
                        <Monitor className="h-4 w-4 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Active Sessions</div>
                          <div className="text-xs text-muted-foreground">Manage devices</div>
                        </div>
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Security Status */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Security Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl glass">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-success" />
                          <div>
                            <div className="font-medium">Password</div>
                            <div className="text-sm text-muted-foreground">Strong password set</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="status-approved">Secure</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl glass">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-5 w-5 text-warning" />
                          <div>
                            <div className="font-medium">Two-Factor Authentication</div>
                            <div className="text-sm text-muted-foreground">Not enabled</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="status-pending">Recommended</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
                      <Palette className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Theme & Display</h3>
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
                          <SelectItem value="light">
                            <div className="flex items-center gap-2">
                              <Sun className="h-4 w-4" />
                              Light
                            </div>
                          </SelectItem>
                          <SelectItem value="dark">
                            <div className="flex items-center gap-2">
                              <Moon className="h-4 w-4" />
                              Dark
                            </div>
                          </SelectItem>
                          <SelectItem value="system">
                            <div className="flex items-center gap-2">
                              <Monitor className="h-4 w-4" />
                              System
                            </div>
                          </SelectItem>
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
                  </div>
                </Card>

                <Card className="glass p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
                      <Globe className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Regional Settings</h3>
                      <p className="text-sm text-muted-foreground">Configure your region</p>
                    </div>
                  </div>

                  <div className="space-y-4">
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
                    <div className="space-y-2">
                      <Label htmlFor="date-format">Date Format</Label>
                      <Select value={settings.dateFormat} onValueChange={(value) => setSettings(prev => ({ ...prev, dateFormat: value }))}>
                        <SelectTrigger className="h-11 rounded-xl focus-ring">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Data Management */}
            <TabsContent value="data" className="space-y-6">
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
                    className="glass-hover h-16 flex-col gap-2"
                  >
                    <Download className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Export Data</div>
                      <div className="text-xs text-muted-foreground">Download your data</div>
                    </div>
                  </Button>
                  <Button
                    onClick={handleImportData}
                    variant="outline"
                    className="glass-hover h-16 flex-col gap-2"
                  >
                    <Upload className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Import Data</div>
                      <div className="text-xs text-muted-foreground">Upload settings</div>
                    </div>
                  </Button>
                  <Button
                    onClick={() => setShowDeleteModal(true)}
                    variant="destructive"
                    className="h-16 flex-col gap-2"
                  >
                    <Trash2 className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Delete Account</div>
                      <div className="text-xs text-destructive-foreground">Permanent action</div>
                    </div>
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Admin Details */}
          <AdminDetails />

          {/* Password Change Modal */}
          <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
            <DialogContent className="glass rounded-2xl">
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="mt-2"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handlePasswordSubmit} disabled={isLoading}>
                    {isLoading ? 'Changing...' : 'Change Password'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* 2FA Setup Modal */}
          <Dialog open={show2FAModal} onOpenChange={setShow2FAModal}>
            <DialogContent className="glass rounded-2xl">
              <DialogHeader>
                <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="h-32 w-32 mx-auto bg-muted rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Scan this QR code with your authenticator app to enable 2FA
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="2fa-code">Enter 6-digit code from your app</Label>
                  <Input
                    id="2fa-code"
                    placeholder="123456"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShow2FAModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handle2FASetup} disabled={isLoading}>
                    {isLoading ? 'Setting up...' : 'Enable 2FA'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Login History Modal */}
          <Dialog open={showLoginHistoryModal} onOpenChange={setShowLoginHistoryModal}>
            <DialogContent className="glass rounded-2xl max-w-2xl">
              <DialogHeader>
                <DialogTitle>Login History</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {[
                    { date: '2024-01-20 14:30', location: 'New York, NY', device: 'Chrome on Windows', ip: '192.168.1.100' },
                    { date: '2024-01-19 09:15', location: 'New York, NY', device: 'Chrome on Windows', ip: '192.168.1.100' },
                    { date: '2024-01-18 16:45', location: 'New York, NY', device: 'Mobile Safari', ip: '10.0.0.1' },
                    { date: '2024-01-17 11:20', location: 'San Francisco, CA', device: 'Firefox on Mac', ip: '203.0.113.1' },
                    { date: '2024-01-16 08:30', location: 'New York, NY', device: 'Chrome on Windows', ip: '192.168.1.100' },
                  ].map((entry, index) => (
                    <div key={index} className="p-4 rounded-lg glass">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{entry.date}</p>
                          <p className="text-sm text-muted-foreground">{entry.location} • {entry.device}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">IP: {entry.ip}</p>
                          {index === 0 && <Badge className="status-approved">Current</Badge>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setShowLoginHistoryModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Active Sessions Modal */}
          <Dialog open={showSessionsModal} onOpenChange={setShowSessionsModal}>
            <DialogContent className="glass rounded-2xl max-w-2xl">
              <DialogHeader>
                <DialogTitle>Active Sessions</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {[
                    { device: 'Chrome on Windows', location: 'New York, NY', lastActive: 'Now', current: true },
                    { device: 'Mobile Safari', location: 'New York, NY', lastActive: '2 hours ago', current: false },
                    { device: 'Firefox on Mac', location: 'San Francisco, CA', lastActive: '1 day ago', current: false },
                  ].map((session, index) => (
                    <div key={index} className="p-4 rounded-lg glass">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Monitor className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{session.device}</p>
                            <p className="text-sm text-muted-foreground">{session.location} • {session.lastActive}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {session.current && <Badge className="status-approved">Current</Badge>}
                          {!session.current && (
                            <Button variant="outline" size="sm">
                              <X className="h-4 w-4 mr-1" />
                              Revoke
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setShowSessionsModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Account Modal */}
          <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
            <DialogContent className="glass rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-destructive">Delete Account</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <p className="font-medium text-destructive">Warning</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone. This will permanently delete your account and remove all data from our servers.
                  </p>
                </div>
                <div>
                  <Label htmlFor="delete-confirm">Type "DELETE" to confirm</Label>
                  <Input
                    id="delete-confirm"
                    placeholder="DELETE"
                    className="mt-2"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      setShowDeleteModal(false);
                      toast({
                        title: "Account Deleted",
                        description: "Your account has been deleted successfully.",
                        variant: "destructive",
                      });
                    }}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default Settings;

