import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Receipt, 
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  merchant: string;
  receipt?: string;
}

const Expenses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Mock data
  useEffect(() => {
    const mockExpenses: Expense[] = [
      {
        id: '1',
        amount: 45.50,
        description: 'Lunch with client',
        category: 'Meals & Entertainment',
        status: 'approved',
        date: '2024-01-20',
        merchant: 'Restaurant ABC',
        receipt: 'receipt-1.jpg'
      },
      {
        id: '2',
        amount: 28.00,
        description: 'Taxi to airport',
        category: 'Travel',
        status: 'pending',
        date: '2024-01-19',
        merchant: 'City Taxi',
        receipt: 'receipt-2.jpg'
      },
      {
        id: '3',
        amount: 125.00,
        description: 'Office supplies',
        category: 'Office Supplies',
        status: 'approved',
        date: '2024-01-18',
        merchant: 'Office Depot',
        receipt: 'receipt-3.jpg'
      },
      {
        id: '4',
        amount: 180.00,
        description: 'Team dinner',
        category: 'Meals & Entertainment',
        status: 'rejected',
        date: '2024-01-17',
        merchant: 'Fine Dining Restaurant',
        receipt: 'receipt-4.jpg'
      },
      {
        id: '5',
        amount: 89.99,
        description: 'Software subscription',
        category: 'Software & Subscriptions',
        status: 'approved',
        date: '2024-01-16',
        merchant: 'Software Corp',
        receipt: 'receipt-5.jpg'
      }
    ];

    setTimeout(() => {
      setExpenses(mockExpenses);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="outline" className="status-approved">Approved</Badge>;
      case 'pending':
        return <Badge variant="outline" className="status-pending">Pending</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="status-rejected">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleAddExpense = () => {
    navigate('/expenses/new');
  };

  const handleViewExpense = (id: string) => {
    navigate(`/expenses/${id}`);
  };

  const handleEditExpense = (id: string) => {
    navigate(`/expenses/${id}/edit`);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const handleExport = () => {
    const exportData = {
      expenses: filteredExpenses,
      summary: {
        totalAmount: filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0),
        totalCount: filteredExpenses.length,
        approvedCount: filteredExpenses.filter(exp => exp.status === 'approved').length,
        pendingCount: filteredExpenses.filter(exp => exp.status === 'pending').length,
        rejectedCount: filteredExpenses.filter(exp => exp.status === 'rejected').length,
      },
      exportDate: new Date().toISOString(),
      filters: {
        searchTerm,
        statusFilter,
        categoryFilter
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex">
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading expenses...</p>
            </div>
          </main>
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

        {/* Expenses Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Expenses</h1>
              <p className="text-muted-foreground mt-1">Track and manage your expense submissions</p>
            </div>
            <Button
              onClick={handleAddExpense}
              className="gradient-primary hover:opacity-90 glow-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>

          {/* Filters */}
          <Card className="glass p-6 rounded-2xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11 rounded-xl focus-ring"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 h-11 rounded-xl focus-ring">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48 h-11 rounded-xl focus-ring">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="Meals & Entertainment">Meals & Entertainment</SelectItem>
                  <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                  <SelectItem value="Software & Subscriptions">Software & Subscriptions</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleExport}
                variant="outline"
                className="glass-hover h-11 px-4"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </Card>

          {/* Expenses List */}
          <div className="space-y-4">
            {filteredExpenses.length === 0 ? (
              <Card className="glass p-12 rounded-2xl text-center">
                <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No expenses found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                    ? 'Try adjusting your filters to see more results.'
                    : 'Start by adding your first expense.'}
                </p>
                <Button
                  onClick={handleAddExpense}
                  className="gradient-primary hover:opacity-90 glow-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </Card>
            ) : (
              filteredExpenses.map((expense) => (
                <Card key={expense.id} className="glass p-6 rounded-2xl glass-hover">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center glow-primary">
                        <Receipt className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{expense.description}</h3>
                        <p className="text-sm text-muted-foreground">{expense.merchant}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-muted-foreground">{expense.category}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{expense.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold">${expense.amount.toFixed(2)}</p>
                        {getStatusBadge(expense.status)}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewExpense(expense.id)}
                          className="glass-hover"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditExpense(expense.id)}
                          className="glass-hover"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="glass-hover text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Summary Stats */}
          <Card className="glass p-6 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">Total Amount</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">
                  {expenses.filter(exp => exp.status === 'approved').length}
                </p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">
                  {expenses.filter(exp => exp.status === 'pending').length}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">
                  {expenses.filter(exp => exp.status === 'rejected').length}
                </p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Expenses;
