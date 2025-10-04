import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Rocket, TrendingUp, Zap, Shield, BarChart3, Receipt, Users, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { z } from 'zod';
import ExpenseFlowLogo from '@/components/ExpenseFlowLogo';

const loginSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  fullName: z.string().min(1, 'Name is required').max(100),
  companyName: z.string().min(1, 'Company name is required').max(100),
  currency: z.string().min(1, 'Currency is required'),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [country, setCountry] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, registerCompany } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const validation = loginSchema.parse({ email, password });
        await login(validation.email, validation.password);
        navigate('/dashboard');
      } else {
        const validation = registerSchema.parse({
          email,
          password,
          fullName,
          companyName,
          currency
        });

        await registerCompany({
          companyName: validation.companyName,
          adminName: validation.fullName,
          adminEmail: validation.email,
          password: validation.password,
          country: country || undefined,
          currency: validation.currency
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      // Error handling is done in the context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Column - Promotional */}
        <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-background via-background to-secondary/10">
          <div className="max-w-lg mx-auto space-y-8">
            {/* Logo */}
            <ExpenseFlowLogo size="lg" />
            
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-foreground">
                Welcome to the Future of Expense Management
              </h1>
              <p className="text-lg text-muted-foreground">
                Join thousands of companies streamlining their expense workflows with AI-powered automation and real-time approvals.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              <Card className="glass p-4 rounded-xl glass-hover">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
                    <Receipt className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">OCR Receipt Processing</h3>
                    <p className="text-sm text-muted-foreground">Auto-extract data from receipts</p>
                  </div>
                </div>
              </Card>

              <Card className="glass p-4 rounded-xl glass-hover">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
                    <Users className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Multi-level Approvals</h3>
                    <p className="text-sm text-muted-foreground">Flexible approval workflows</p>
                  </div>
                </div>
              </Card>

              <Card className="glass p-4 rounded-xl glass-hover">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
                    <BarChart3 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Real-time Analytics</h3>
                    <p className="text-sm text-muted-foreground">Track spending patterns instantly</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm text-muted-foreground">SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm text-muted-foreground">256-bit Encryption</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Auth Form */}
        <div className="flex items-center justify-center p-8">
          <Card className="w-full max-w-md glass p-8 rounded-2xl">
            <div className="text-center mb-8">
              <ExpenseFlowLogo size="md" showText={false} className="justify-center mb-4" />
              <h2 className="text-2xl font-bold mb-2">Get Started</h2>
              <p className="text-muted-foreground">Sign in to your account or create a new one</p>
            </div>

            <Tabs defaultValue="login" className="w-full" onValueChange={(v) => setIsLogin(v === 'login')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 rounded-xl focus-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 rounded-xl focus-ring"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full gradient-primary hover:opacity-90 glow-primary h-11 rounded-xl"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="h-11 rounded-xl focus-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">Email</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      placeholder="admin@acme.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 rounded-xl focus-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">Password</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 rounded-xl focus-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Acme Corp"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      className="h-11 rounded-xl focus-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country (Optional)</Label>
                    <Input
                      id="country"
                      type="text"
                      placeholder="United States"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="h-11 rounded-xl focus-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="h-11 rounded-xl focus-ring">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Amount may be in other currency; shown in company default.
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-primary hover:opacity-90 glow-primary h-11 rounded-xl"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              Use Tab to navigate form fields
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
