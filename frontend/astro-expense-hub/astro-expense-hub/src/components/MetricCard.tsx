import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
  icon: React.ComponentType<{ className?: string }>;
  status?: 'approved' | 'pending' | 'rejected';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  status,
  className = ''
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  return (
    <Card className={`glass p-6 rounded-2xl glass-hover transition-smooth ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
              {changeType === 'increase' ? (
                <ArrowUpRight className="h-4 w-4 text-success" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-destructive" />
              )}
              <span className={`text-sm font-medium ${
                changeType === 'increase' ? 'text-success' : 'text-destructive'
              }`}>
                {change}
              </span>
              <span className="text-sm text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
          status ? getStatusColor() : 'gradient-primary'
        } ${status ? '' : 'glow-primary'}`}>
          <Icon className={`h-6 w-6 ${
            status ? '' : 'text-primary-foreground'
          }`} />
        </div>
      </div>
    </Card>
  );
};

// Dashboard Metrics Component
export const DashboardMetrics: React.FC = () => {
  const metrics = [
    {
      title: 'Total Expenses',
      value: '$12,450',
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: DollarSign,
    },
    {
      title: 'Pending Approval',
      value: '8',
      change: '-3',
      changeType: 'decrease' as const,
      icon: Clock,
      status: 'pending' as const,
    },
    {
      title: 'Approved This Month',
      value: '47',
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: CheckCircle,
      status: 'approved' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          changeType={metric.changeType}
          icon={metric.icon}
          status={metric.status}
        />
      ))}
    </div>
  );
};

export default MetricCard;
