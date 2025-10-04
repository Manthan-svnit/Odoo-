import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import AdminDetails from '@/components/AdminDetails';
import ExpenseForm from '@/components/ExpenseForm';

const AddExpense = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    console.log('Expense submitted:', data);
    // TODO: Implement API call to submit expense
    navigate('/expenses');
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

        {/* Add Expense Content */}
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/expenses')}
              className="glass-hover"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Expenses
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Add New Expense</h1>
              <p className="text-muted-foreground mt-1">Submit a new expense with receipt upload</p>
            </div>
          </div>

          {/* Expense Form */}
          <ExpenseForm onSubmit={handleSubmit} />

          {/* Admin Details */}
          <AdminDetails />
        </main>
      </div>
    </div>
  );
};

export default AddExpense;

