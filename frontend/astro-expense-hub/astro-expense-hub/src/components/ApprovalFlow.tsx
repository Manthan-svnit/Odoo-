import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  ArrowRight,
  User,
  Crown,
  Shield
} from 'lucide-react';

interface ApprovalStep {
  id: string;
  role: string;
  approver: {
    name: string;
    avatar?: string;
    email: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  date?: string;
  comments?: string;
  stepNumber: number;
}

interface ApprovalFlowProps {
  steps: ApprovalStep[];
  currentStep: number;
  className?: string;
}

export const ApprovalFlow: React.FC<ApprovalFlowProps> = ({ 
  steps, 
  currentStep, 
  className = '' 
}) => {
  const getStepIcon = (step: ApprovalStep) => {
    switch (step.status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'skipped':
        return <Clock className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Clock className="h-5 w-5 text-warning" />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'manager':
        return <User className="h-4 w-4" />;
      case 'director':
        return <Crown className="h-4 w-4" />;
      case 'cfo':
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getStepStatus = (step: ApprovalStep, index: number) => {
    if (step.status === 'approved') return 'status-approved';
    if (step.status === 'rejected') return 'status-rejected';
    if (index === currentStep) return 'status-pending';
    if (index < currentStep) return 'status-approved';
    return '';
  };

  return (
    <Card className={`glass p-6 rounded-2xl ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
          <CheckCircle className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">Approval Flow</h3>
          <p className="text-sm text-muted-foreground">Multi-level approval process</p>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-4">
            {/* Step Number & Icon */}
            <div className="flex flex-col items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${
                index === currentStep 
                  ? 'border-primary bg-primary/20 glow-primary' 
                  : index < currentStep 
                    ? 'border-success bg-success/20' 
                    : 'border-muted bg-muted/20'
              }`}>
                {index < currentStep ? (
                  getStepIcon(step)
                ) : (
                  <span className={`text-sm font-semibold ${
                    index === currentStep ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {step.stepNumber}
                  </span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-0.5 h-8 mt-2 ${
                  index < currentStep ? 'bg-success' : 'bg-muted'
                }`} />
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={step.approver.avatar} />
                    <AvatarFallback className="gradient-primary text-primary-foreground text-xs">
                      {step.approver.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{step.approver.name}</p>
                    <p className="text-xs text-muted-foreground">{step.approver.email}</p>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getStepStatus(step, index)}`}
                >
                  {step.status === 'pending' ? 'Pending' : 
                   step.status === 'approved' ? 'Approved' :
                   step.status === 'rejected' ? 'Rejected' : 'Skipped'}
                </Badge>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                  {getRoleIcon(step.role)}
                </div>
                <span className="text-sm font-medium">{step.role}</span>
              </div>

              {step.comments && (
                <div className="p-3 rounded-xl glass text-sm">
                  <p className="text-muted-foreground mb-1">Comments:</p>
                  <p>{step.comments}</p>
                </div>
              )}

              {step.date && (
                <p className="text-xs text-muted-foreground mt-1">
                  {step.status === 'pending' ? 'Waiting for approval' : `Processed on ${step.date}`}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Alternative Approval Rules */}
      <div className="mt-6 p-4 rounded-xl glass border border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Alternative Approval Rules</span>
        </div>
        <p className="text-xs text-muted-foreground">
          60% approval OR CFO auto-approve for amounts under $500
        </p>
      </div>
    </Card>
  );
};

// Approval Modal Component
interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: any;
  onApprove: (comments?: string) => void;
  onReject: (comments: string) => void;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  expense,
  onApprove,
  onReject
}) => {
  const [comments, setComments] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove(comments);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!comments.trim()) return;
    setIsProcessing(true);
    try {
      await onReject(comments);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="glass p-6 rounded-2xl max-w-md w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
            <CheckCircle className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">Approve Expense</h3>
            <p className="text-sm text-muted-foreground">Review and approve this expense</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Amount:</span>
            <span className="font-semibold">${expense?.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Description:</span>
            <span className="font-semibold">{expense?.description}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Category:</span>
            <span className="font-semibold">{expense?.category}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Comments (Optional)</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add any comments about this approval..."
              className="w-full p-3 rounded-xl glass focus-ring"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleApprove}
              disabled={isProcessing}
              className="gradient-primary hover:opacity-90 glow-primary flex-1"
            >
              {isProcessing ? 'Processing...' : 'Approve & Continue'}
            </Button>
            <Button
              onClick={handleReject}
              disabled={isProcessing || !comments.trim()}
              variant="destructive"
              className="flex-1"
            >
              Reject
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ApprovalFlow;
