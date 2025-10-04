import { useState } from 'react';
import { apiService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function TestConnection() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const { toast } = useToast();

  const testBackendConnection = async () => {
    setLoading(true);
    setResult('Testing connection...');
    
    try {
      // Test basic connectivity
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.status === 401) {
        setResult('✅ Backend is running! (401 is expected without auth token)');
        toast({
          title: "Success",
          description: "Backend connection is working",
        });
      } else {
        setResult(`✅ Backend is running! Status: ${response.status}`);
        toast({
          title: "Success",
          description: "Backend connection is working",
        });
      }
    } catch (error: any) {
      setResult(`❌ Connection failed: ${error.message}`);
      toast({
        title: "Error",
        description: "Backend connection failed",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testRegisterCompany = async () => {
    setLoading(true);
    setResult('Testing company registration...');
    
    try {
      const testData = {
        companyName: 'Test Company',
        adminName: 'Test Admin',
        adminEmail: 'test@testcompany.com',
        password: 'password123',
        country: 'Test Country',
        currency: 'USD'
      };

      const response = await apiService.registerCompany(testData);
      setResult(`✅ Company registration successful! User: ${response.user.name}`);
      toast({
        title: "Success",
        description: "Company registration test passed",
      });
    } catch (error: any) {
      setResult(`❌ Registration failed: ${error.message}`);
      toast({
        title: "Error",
        description: "Company registration test failed",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Backend Connection Test
          </h1>
          <p className="text-muted-foreground mt-2">
            Test the connection between frontend and backend
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-4">Basic Connection Test</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Test if the backend is running and accessible
            </p>
            <Button 
              onClick={testBackendConnection}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </Button>
          </Card>

          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-4">Registration Test</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Test company registration endpoint
            </p>
            <Button 
              onClick={testRegisterCompany}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              {loading ? 'Testing...' : 'Test Registration'}
            </Button>
          </Card>
        </div>

        {result && (
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-4">Test Result</h3>
            <pre className="text-sm bg-muted/20 p-4 rounded-lg overflow-auto">
              {result}
            </pre>
          </Card>
        )}

        <div className="text-center">
          <Button 
            onClick={() => window.location.href = '/'}
            variant="outline"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
