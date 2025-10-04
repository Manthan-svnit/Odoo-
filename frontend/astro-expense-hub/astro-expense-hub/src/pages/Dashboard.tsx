import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Receipt, 
  TrendingUp, 
  PieChart,
  BarChart3,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { DashboardMetrics } from '@/components/MetricCard';

const Dashboard = () => {
  const { user, company, loading } = useAuth();
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState({
    totalExpenses: 0,
    pendingApprovals: 0,
    approvedExpenses: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Load dashboard stats from API
    loadDashboardStats();
  }, [user]);

  const loadDashboardStats = async () => {
    // TODO: Replace with actual API calls
    setDashboardStats({
      totalExpenses: 12450,
      pendingApprovals: 8,
      approvedExpenses: 47,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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

        {/* Dashboard Content */}
        <main className="flex-1 p-6 space-y-8">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Here's what's happening with your expenses at {company?.name || 'your company'}.
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="glass-hover"
                onClick={() => navigate('/expenses')}
              >
                <Filter className="h-4 w-4 mr-2" />
                View Expenses
              </Button>
              <Button 
                variant="outline" 
                className="glass-hover"
                onClick={() => {
                  // Export functionality
                  const data = dashboardStats;
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'expense-data.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                className="gradient-primary hover:opacity-90 glow-primary"
                onClick={() => navigate('/expenses/new')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>
          </div>

          {/* Metrics */}
          <DashboardMetrics />

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <Card className="glass p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Expense Categories</h3>
                <Button variant="ghost" size="sm">
                  <PieChart className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Travel', amount: '$4,200', percentage: 34, color: 'bg-primary' },
                  { name: 'Meals', amount: '$2,800', percentage: 22, color: 'bg-secondary' },
                  { name: 'Office Supplies', amount: '$1,900', percentage: 15, color: 'bg-success' },
                  { name: 'Software', amount: '$1,500', percentage: 12, color: 'bg-warning' },
                  { name: 'Other', amount: '$2,050', percentage: 17, color: 'bg-muted' },
                ].map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${category.color}`} />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{category.amount}</p>
                      <p className="text-xs text-muted-foreground">{category.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="glass p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <Button variant="ghost" size="sm">
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {[
                  { 
                    type: 'expense', 
                    description: 'Lunch with client', 
                    amount: '$45.50', 
                    status: 'approved',
                    time: '2 hours ago'
                  },
                  { 
                    type: 'expense', 
                    description: 'Taxi to airport', 
                    amount: '$28.00', 
                    status: 'pending',
                    time: '4 hours ago'
                  },
                  { 
                    type: 'expense', 
                    description: 'Office supplies', 
                    amount: '$125.00', 
                    status: 'approved',
                    time: '1 day ago'
                  },
                  { 
                    type: 'expense', 
                    description: 'Team dinner', 
                    amount: '$180.00', 
                    status: 'rejected',
                    time: '2 days ago'
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-xl glass-hover">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                        <Receipt className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{activity.amount}</p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          activity.status === 'approved' ? 'status-approved' :
                          activity.status === 'pending' ? 'status-pending' :
                          'status-rejected'
                        }`}
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="glass p-6 rounded-2xl">
            <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 glass-hover"
                onClick={() => navigate('/expenses/new')}
              >
                <Plus className="h-6 w-6" />
                <span>Add Expense</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 glass-hover"
                onClick={() => navigate('/expenses/new')}
              >
                <Receipt className="h-6 w-6" />
                <span>Upload Receipt</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 glass-hover"
                onClick={() => navigate('/profile')}
              >
                <Calendar className="h-6 w-6" />
                <span>View Profile</span>
              </Button>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;