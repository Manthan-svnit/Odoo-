import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MessageSquare,
  Calendar,
  DollarSign,
  User,
  Building,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  X,
  MoreHorizontal,
  ArrowRight,
  FileText,
  Image,
  CreditCard,
  MapPin,
  Clock3,
  Send,
  X as CloseIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import AdminDetails from '@/components/AdminDetails';
import { useToast } from '@/hooks/use-toast';

interface ApprovalItem {
  id: string;
  title: string;
  amount: number;
  currency: string;
  category: string;
  submittedBy: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  receipt?: string;
  location?: string;
  paymentMethod?: string;
  tags: string[];
  approvalFlow: {
    step: number;
    totalSteps: number;
    approvers: Array<{
      name: string;
      role: string;
      status: 'pending' | 'approved' | 'rejected';
      date?: string;
      comment?: string;
    }>;
  };
  comments: Array<{
    id: string;
    author: string;
    message: string;
    timestamp: string;
  }>;
}

const Approvals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [showCommentModal, setShowCommentModal] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [showViewModal, setShowViewModal] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  // Mock data for approvals
  const [approvals, setApprovals] = useState<ApprovalItem[]>([
    {
      id: '1',
      title: 'Client Dinner - Tech Conference',
      amount: 450.00,
      currency: 'USD',
      category: 'Meals & Entertainment',
      submittedBy: 'Sarah Johnson',
      submittedDate: '2024-01-15',
      status: 'pending',
      priority: 'medium',
      description: 'Business dinner with potential clients at the annual tech conference',
      receipt: '/receipts/receipt-1.jpg',
      location: 'San Francisco, CA',
      paymentMethod: 'Corporate Credit Card',
      tags: ['client', 'conference', 'dinner'],
      approvalFlow: {
        step: 2,
        totalSteps: 3,
        approvers: [
          { name: 'Mike Chen', role: 'Manager', status: 'approved', date: '2024-01-16' },
          { name: 'Lisa Wang', role: 'Director', status: 'pending' },
          { name: 'John Smith', role: 'VP Finance', status: 'pending' }
        ]
      },
      comments: [
        {
          id: '1',
          author: 'Mike Chen',
          message: 'Looks good, approved for client entertainment',
          timestamp: '2024-01-16T10:30:00Z'
        }
      ]
    },
    {
      id: '2',
      title: 'Software License - Adobe Creative Suite',
      amount: 1200.00,
      currency: 'USD',
      category: 'Software & Tools',
      submittedBy: 'Alex Rodriguez',
      submittedDate: '2024-01-14',
      status: 'under_review',
      priority: 'high',
      description: 'Annual subscription for Adobe Creative Suite for design team',
      receipt: '/receipts/receipt-2.pdf',
      location: 'Remote',
      paymentMethod: 'Purchase Order',
      tags: ['software', 'subscription', 'design'],
      approvalFlow: {
        step: 1,
        totalSteps: 2,
        approvers: [
          { name: 'Emma Davis', role: 'IT Manager', status: 'pending' },
          { name: 'Robert Kim', role: 'CFO', status: 'pending' }
        ]
      },
      comments: []
    },
    {
      id: '3',
      title: 'Office Supplies - Stationery',
      amount: 85.50,
      currency: 'USD',
      category: 'Office Supplies',
      submittedBy: 'Maria Garcia',
      submittedDate: '2024-01-13',
      status: 'approved',
      priority: 'low',
      description: 'Monthly office supplies including pens, notebooks, and folders',
      receipt: '/receipts/receipt-3.jpg',
      location: 'Office Depot, New York',
      paymentMethod: 'Company Card',
      tags: ['office', 'supplies', 'monthly'],
      approvalFlow: {
        step: 2,
        totalSteps: 2,
        approvers: [
          { name: 'Tom Wilson', role: 'Office Manager', status: 'approved', date: '2024-01-14' },
          { name: 'Sarah Johnson', role: 'Manager', status: 'approved', date: '2024-01-14' }
        ]
      },
      comments: [
        {
          id: '2',
          author: 'Tom Wilson',
          message: 'Approved - within budget',
          timestamp: '2024-01-14T09:15:00Z'
        }
      ]
    },
    {
      id: '4',
      title: 'Business Travel - Conference',
      amount: 2500.00,
      currency: 'USD',
      category: 'Travel',
      submittedBy: 'David Lee',
      submittedDate: '2024-01-12',
      status: 'rejected',
      priority: 'high',
      description: 'Flight and hotel for industry conference in Las Vegas',
      receipt: '/receipts/receipt-4.pdf',
      location: 'Las Vegas, NV',
      paymentMethod: 'Corporate Travel Card',
      tags: ['travel', 'conference', 'flight', 'hotel'],
      approvalFlow: {
        step: 1,
        totalSteps: 3,
        approvers: [
          { name: 'Jennifer Brown', role: 'Manager', status: 'rejected', date: '2024-01-13', comment: 'Exceeds travel budget for Q1' },
          { name: 'Michael Taylor', role: 'Director', status: 'pending' },
          { name: 'Lisa Wang', role: 'VP', status: 'pending' }
        ]
      },
      comments: [
        {
          id: '3',
          author: 'Jennifer Brown',
          message: 'Rejected - exceeds Q1 travel budget. Please consider virtual attendance or local alternatives.',
          timestamp: '2024-01-13T14:20:00Z'
        }
      ]
    }
  ]);

  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || approval.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || approval.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'under_review': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'status-pending';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'status-pending';
    }
  };

  const handleApprove = (id: string) => {
    setIsLoading(true);
    setApprovals(prev => prev.map(approval => 
      approval.id === id 
        ? { ...approval, status: 'approved' as const }
        : approval
    ));
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Approved",
        description: "Expense has been approved successfully.",
      });
    }, 1000);
  };

  const handleReject = (id: string, reason?: string) => {
    setIsLoading(true);
    setApprovals(prev => prev.map(approval => 
      approval.id === id 
        ? { 
            ...approval, 
            status: 'rejected' as const,
            comments: reason ? [...approval.comments, {
              id: Date.now().toString(),
              author: user?.name || 'Admin',
              message: `Rejected: ${reason}`,
              timestamp: new Date().toISOString()
            }] : approval.comments
          }
        : approval
    ));
    
    setTimeout(() => {
      setIsLoading(false);
      setRejectionReason('');
      setShowRejectModal(null);
      toast({
        title: "Rejected",
        description: reason ? `Expense has been rejected: ${reason}` : "Expense has been rejected.",
        variant: "destructive",
      });
    }, 1000);
  };

  const handleBulkApprove = () => {
    if (selectedItems.length === 0) return;
    
    setIsLoading(true);
    setApprovals(prev => prev.map(approval => 
      selectedItems.includes(approval.id)
        ? { ...approval, status: 'approved' as const }
        : approval
    ));
    
    setTimeout(() => {
      setIsLoading(false);
      setSelectedItems([]);
      toast({
        title: "Bulk Approved",
        description: `${selectedItems.length} expenses have been approved.`,
      });
    }, 1000);
  };

  const handleBulkReject = () => {
    if (selectedItems.length === 0) return;
    
    setIsLoading(true);
    setApprovals(prev => prev.map(approval => 
      selectedItems.includes(approval.id)
        ? { ...approval, status: 'rejected' as const }
        : approval
    ));
    
    setTimeout(() => {
      setIsLoading(false);
      setSelectedItems([]);
      toast({
        title: "Bulk Rejected",
        description: `${selectedItems.length} expenses have been rejected.`,
        variant: "destructive",
      });
    }, 1000);
  };

  const handleExport = () => {
    const data = filteredApprovals.map(approval => ({
      id: approval.id,
      title: approval.title,
      amount: approval.amount,
      currency: approval.currency,
      category: approval.category,
      submittedBy: approval.submittedBy,
      submittedDate: approval.submittedDate,
      status: approval.status,
      priority: approval.priority
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `approvals-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Exported",
      description: "Approvals data has been exported successfully.",
    });
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItems(filteredApprovals.map(item => item.id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const handleAddComment = (id: string) => {
    if (!newComment.trim()) return;
    
    setApprovals(prev => prev.map(approval => 
      approval.id === id 
        ? {
            ...approval,
            comments: [...approval.comments, {
              id: Date.now().toString(),
              author: user?.name || 'Admin',
              message: newComment,
              timestamp: new Date().toISOString()
            }]
          }
        : approval
    ));
    
    setNewComment('');
    setShowCommentModal(null);
    toast({
      title: "Comment Added",
      description: "Your comment has been added successfully.",
    });
  };

  const handleViewDetails = (id: string) => {
    setShowViewModal(id);
  };

  const getApprovalById = (id: string) => {
    return approvals.find(approval => approval.id === id);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Approvals Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Approvals</h1>
              <p className="text-muted-foreground mt-1">Review and approve expense claims</p>
            </div>
            <div className="flex gap-3">
              {selectedItems.length > 0 && (
                <>
                  <Button
                    onClick={handleBulkApprove}
                    disabled={isLoading}
                    className="gradient-primary hover:opacity-90 glow-primary"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Selected ({selectedItems.length})
                  </Button>
                  <Button
                    onClick={handleBulkReject}
                    disabled={isLoading}
                    variant="destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Selected ({selectedItems.length})
                  </Button>
                </>
              )}
              <Button
                onClick={handleExport}
                variant="outline"
                className="glass-hover"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="glass p-6 rounded-2xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search approvals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-11 rounded-xl focus-ring"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40 h-11 rounded-xl focus-ring">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-40 h-11 rounded-xl focus-ring">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                {selectedItems.length > 0 && (
                  <Button
                    onClick={clearSelection}
                    variant="outline"
                    className="glass-hover"
                  >
                    Clear Selection
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Approvals Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending ({approvals.filter(a => a.status === 'pending').length})
              </TabsTrigger>
              <TabsTrigger value="under_review" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Under Review ({approvals.filter(a => a.status === 'under_review').length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Approved ({approvals.filter(a => a.status === 'approved').length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Rejected ({approvals.filter(a => a.status === 'rejected').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {/* Select All */}
              <div className="flex items-center justify-between">
                <Button
                  onClick={selectAll}
                  variant="outline"
                  size="sm"
                  className="glass-hover"
                >
                  Select All
                </Button>
                <span className="text-sm text-muted-foreground">
                  {filteredApprovals.length} items
                </span>
              </div>

              {/* Approvals List */}
              <div className="space-y-4">
                {filteredApprovals.map((approval) => (
                  <Card key={approval.id} className="glass p-6 rounded-2xl glass-hover">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(approval.id)}
                          onChange={() => toggleSelectItem(approval.id)}
                          className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        />

                        {/* Main Content */}
                        <div className="flex-1 space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <h3 className="text-lg font-semibold text-foreground">
                                {approval.title}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {approval.submittedBy}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(approval.submittedDate).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  {approval.currency} {approval.amount.toFixed(2)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(approval.status)}>
                                {approval.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                              <Badge className={getPriorityColor(approval.priority)}>
                                {approval.priority.toUpperCase()}
                              </Badge>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm font-medium text-foreground">Category</p>
                              <p className="text-sm text-muted-foreground">{approval.category}</p>
                            </div>
                            {approval.location && (
                              <div>
                                <p className="text-sm font-medium text-foreground">Location</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {approval.location}
                                </p>
                              </div>
                            )}
                            {approval.paymentMethod && (
                              <div>
                                <p className="text-sm font-medium text-foreground">Payment Method</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <CreditCard className="h-3 w-3" />
                                  {approval.paymentMethod}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1">Description</p>
                            <p className="text-sm text-muted-foreground">{approval.description}</p>
                          </div>

                          {/* Tags */}
                          {approval.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {approval.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Approval Flow */}
                          <div className="space-y-3">
                            <p className="text-sm font-medium text-foreground">Approval Flow</p>
                            <div className="flex items-center gap-2">
                              {approval.approvalFlow.approvers.map((approver, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                    approver.status === 'approved' ? 'bg-green-500 text-white' :
                                    approver.status === 'rejected' ? 'bg-red-500 text-white' :
                                    'bg-muted text-muted-foreground'
                                  }`}>
                                    {index + 1}
                                  </div>
                                  <div className="text-sm">
                                    <p className="font-medium">{approver.name}</p>
                                    <p className="text-muted-foreground">{approver.role}</p>
                                  </div>
                                  {index < approval.approvalFlow.approvers.length - 1 && (
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Comments */}
                          {approval.comments.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-foreground">Comments</p>
                              {approval.comments.map((comment) => (
                                <div key={comment.id} className="p-3 rounded-lg glass text-sm">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium">{comment.author}</span>
                                    <span className="text-muted-foreground">
                                      {new Date(comment.timestamp).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-muted-foreground">{comment.message}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 ml-4">
                        {approval.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => handleApprove(approval.id)}
                              disabled={isLoading}
                              size="sm"
                              className="gradient-primary hover:opacity-90 glow-primary"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Dialog open={showRejectModal === approval.id} onOpenChange={(open) => setShowRejectModal(open ? approval.id : null)}>
                              <DialogTrigger asChild>
                                <Button
                                  disabled={isLoading}
                                  size="sm"
                                  variant="destructive"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="glass rounded-2xl">
                                <DialogHeader>
                                  <DialogTitle>Reject Expense</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="rejection-reason">Reason for rejection (optional)</Label>
                                    <Textarea
                                      id="rejection-reason"
                                      placeholder="Enter reason for rejection..."
                                      value={rejectionReason}
                                      onChange={(e) => setRejectionReason(e.target.value)}
                                      className="mt-2"
                                    />
                                  </div>
                                  <div className="flex gap-2 justify-end">
                                    <Button
                                      variant="outline"
                                      onClick={() => setShowRejectModal(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleReject(approval.id, rejectionReason)}
                                    >
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                        <Button
                          onClick={() => handleViewDetails(approval.id)}
                          variant="outline"
                          size="sm"
                          className="glass-hover"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Dialog open={showCommentModal === approval.id} onOpenChange={(open) => setShowCommentModal(open ? approval.id : null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="glass-hover"
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Comment
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="glass rounded-2xl">
                            <DialogHeader>
                              <DialogTitle>Add Comment</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="comment">Comment</Label>
                                <Textarea
                                  id="comment"
                                  placeholder="Enter your comment..."
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  className="mt-2"
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  onClick={() => setShowCommentModal(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => handleAddComment(approval.id)}
                                  disabled={!newComment.trim()}
                                >
                                  <Send className="h-4 w-4 mr-1" />
                                  Send
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredApprovals.length === 0 && (
                <Card className="glass p-12 rounded-2xl text-center">
                  <Clock3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No approvals found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                      ? 'Try adjusting your filters to see more results.'
                      : 'No expense approvals are available at the moment.'}
                  </p>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Admin Details */}
          <AdminDetails />

          {/* View Details Modal */}
          <Dialog open={!!showViewModal} onOpenChange={(open) => setShowViewModal(open ? showViewModal : null)}>
            <DialogContent className="glass rounded-2xl max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Expense Details
                </DialogTitle>
              </DialogHeader>
              {showViewModal && (() => {
                const approval = getApprovalById(showViewModal);
                if (!approval) return null;
                
                return (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">{approval.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {approval.submittedBy}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(approval.submittedDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {approval.currency} {approval.amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(approval.status)}>
                          {approval.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge className={getPriorityColor(approval.priority)}>
                          {approval.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Expense Information</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Category:</span>
                              <span className="font-medium">{approval.category}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Amount:</span>
                              <span className="font-medium">{approval.currency} {approval.amount.toFixed(2)}</span>
                            </div>
                            {approval.location && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Location:</span>
                                <span className="font-medium">{approval.location}</span>
                              </div>
                            )}
                            {approval.paymentMethod && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment Method:</span>
                                <span className="font-medium">{approval.paymentMethod}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Description</h4>
                          <p className="text-muted-foreground">{approval.description}</p>
                        </div>

                        {approval.tags.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                              {approval.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Approval Flow</h4>
                          <div className="space-y-3">
                            {approval.approvalFlow.approvers.map((approver, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 rounded-lg glass">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                  approver.status === 'approved' ? 'bg-green-500 text-white' :
                                  approver.status === 'rejected' ? 'bg-red-500 text-white' :
                                  'bg-muted text-muted-foreground'
                                }`}>
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{approver.name}</p>
                                  <p className="text-sm text-muted-foreground">{approver.role}</p>
                                  {approver.date && (
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(approver.date).toLocaleString()}
                                    </p>
                                  )}
                                  {approver.comment && (
                                    <p className="text-xs text-muted-foreground mt-1 italic">
                                      "{approver.comment}"
                                    </p>
                                  )}
                                </div>
                                {approver.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-500" />}
                                {approver.status === 'rejected' && <XCircle className="h-4 w-4 text-red-500" />}
                                {approver.status === 'pending' && <Clock className="h-4 w-4 text-muted-foreground" />}
                              </div>
                            ))}
                          </div>
                        </div>

                        {approval.comments.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">Comments</h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {approval.comments.map((comment) => (
                                <div key={comment.id} className="p-3 rounded-lg glass text-sm">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium">{comment.author}</span>
                                    <span className="text-muted-foreground">
                                      {new Date(comment.timestamp).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-muted-foreground">{comment.message}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Receipt Preview */}
                    {approval.receipt && (
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Receipt</h4>
                        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                          <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">Receipt attached: {approval.receipt}</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            <Eye className="h-4 w-4 mr-1" />
                            View Receipt
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default Approvals;
