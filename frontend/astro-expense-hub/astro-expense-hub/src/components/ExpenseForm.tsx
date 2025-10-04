import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Camera, 
  Receipt, 
  DollarSign, 
  Calendar,
  MapPin,
  FileText,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface ExpenseFormProps {
  onSubmit?: (data: any) => void;
  className?: string;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, className = '' }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    merchant: '',
    location: '',
    notes: '',
    receipt: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ocrPreview, setOcrPreview] = useState<{
    amount?: string;
    date?: string;
    merchant?: string;
  } | null>(null);

  const categories = [
    'Travel',
    'Meals & Entertainment',
    'Office Supplies',
    'Software & Subscriptions',
    'Marketing',
    'Training & Development',
    'Other'
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, receipt: file }));
      
      // Simulate OCR processing
      setTimeout(() => {
        setOcrPreview({
          amount: '$45.50',
          date: '2024-01-15',
          merchant: 'Starbucks Coffee'
        });
      }, 1000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSubmit?.(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* OCR Receipt Section */}
      <Card className="glass p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
            <Camera className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">Receipt Upload</h3>
            <p className="text-sm text-muted-foreground">Auto-extract data from receipts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Area */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-primary/30 rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
              <Upload className="h-8 w-8 mx-auto mb-3 text-primary" />
              <p className="text-sm font-medium mb-2">Upload Receipt</p>
              <p className="text-xs text-muted-foreground mb-4">
                Drag & drop or click to browse
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="receipt-upload"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('receipt-upload')?.click()}
                className="glass-hover"
              >
                Choose File
              </Button>
            </div>

            {formData.receipt && (
              <div className="flex items-center gap-3 p-3 rounded-xl glass">
                <Receipt className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{formData.receipt.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(formData.receipt.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Badge variant="outline" className="status-approved">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Uploaded
                </Badge>
              </div>
            )}
          </div>

          {/* OCR Preview */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">OCR Preview</h4>
            {ocrPreview ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl glass">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-success" />
                    <span className="text-sm">Amount</span>
                  </div>
                  <span className="font-semibold">{ocrPreview.amount}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl glass">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm">Date</span>
                  </div>
                  <span className="font-semibold">{ocrPreview.date}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl glass">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Merchant</span>
                  </div>
                  <span className="font-semibold">{ocrPreview.merchant}</span>
                </div>
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
                Upload a receipt to see OCR preview
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Expense Form */}
      <Card className="glass p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">Expense Details</h3>
            <p className="text-sm text-muted-foreground">Fill in the expense information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="h-11 rounded-xl focus-ring"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="h-11 rounded-xl focus-ring"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                placeholder="Brief description of the expense"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="h-11 rounded-xl focus-ring"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="h-11 rounded-xl focus-ring">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="merchant">Merchant</Label>
              <Input
                id="merchant"
                placeholder="Store or vendor name"
                value={formData.merchant}
                onChange={(e) => setFormData(prev => ({ ...prev, merchant: e.target.value }))}
                className="h-11 rounded-xl focus-ring"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, State"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="h-11 rounded-xl focus-ring"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes or comments"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="rounded-xl focus-ring"
              rows={3}
            />
          </div>

          <div className="text-xs text-muted-foreground">
            Amount may be in other currency; shown in company default.
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="gradient-primary hover:opacity-90 glow-primary h-11 rounded-xl flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Expense'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="glass-hover h-11 rounded-xl"
            >
              Save Draft
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ExpenseForm;
