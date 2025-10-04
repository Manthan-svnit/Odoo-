import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Shield, BarChart3, Receipt, Users, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ExpenseFlowLogo from '@/components/ExpenseFlowLogo';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <ExpenseFlowLogo size="lg" />
            </div>
            
            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                ExpenseFlow
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Next-gen expense management • OCR receipts • Multi-level approvals
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                size="lg"
                className="gradient-primary hover:opacity-90 glow-primary text-lg px-8 h-12 rounded-xl"
                onClick={() => navigate('/auth')}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="glass-hover text-lg px-8 h-12 rounded-xl border-primary/30 text-primary hover:bg-primary/10"
                onClick={() => navigate('/test')}
              >
                Test Connection
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose ExpenseFlow?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for the future of finance with cutting-edge technology and intuitive design
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card className="glass p-8 rounded-2xl glass-hover transition-smooth group">
            <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center mb-6 glow-primary group-hover:scale-110 transition-transform">
              <Zap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Lightning Fast</h3>
            <p className="text-muted-foreground mb-4">
              Submit and approve expenses in seconds with our intuitive interface 
              and automated workflows
            </p>
            <Badge variant="outline" className="status-pending">
              <Clock className="h-3 w-3 mr-1" />
              Real-time
            </Badge>
          </Card>

          {/* Feature 2 */}
          <Card className="glass p-8 rounded-2xl glass-hover transition-smooth group">
            <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center mb-6 glow-primary group-hover:scale-110 transition-transform">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Enterprise Security</h3>
            <p className="text-muted-foreground mb-4">
              Bank-level encryption and role-based access control protect your 
              sensitive financial data
            </p>
            <Badge variant="outline" className="status-approved">
              <Users className="h-3 w-3 mr-1" />
              Multi-level
            </Badge>
          </Card>

          {/* Feature 3 */}
          <Card className="glass p-8 rounded-2xl glass-hover transition-smooth group">
            <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center mb-6 glow-primary group-hover:scale-110 transition-transform">
              <BarChart3 className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Smart Analytics</h3>
            <p className="text-muted-foreground mb-4">
              Track spending patterns and make data-driven decisions with 
              comprehensive dashboards
            </p>
            <Badge variant="outline" className="status-approved">
              <Receipt className="h-3 w-3 mr-1" />
              OCR Ready
            </Badge>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Card className="glass p-12 rounded-3xl text-center gradient-card">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Expense Management?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join forward-thinking companies using ExpenseFlow to save time and reduce costs
          </p>
          <Button
            size="lg"
            className="gradient-primary hover:opacity-90 glow-primary text-lg px-12 h-12 rounded-xl"
            onClick={() => navigate('/auth')}
          >
            Start Free Trial
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Index;
