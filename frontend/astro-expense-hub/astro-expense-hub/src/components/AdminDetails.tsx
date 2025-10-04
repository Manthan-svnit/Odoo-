import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Building, Shield, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminDetailsProps {
  className?: string;
}

export const AdminDetails: React.FC<AdminDetailsProps> = ({ className = '' }) => {
  const { user, company } = useAuth();

  if (!user) return null;

  return (
    <Card className={`glass p-4 rounded-xl ${className}`}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-foreground truncate">{user.name || 'Admin User'}</h4>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                user.role === 'Admin' ? 'status-approved' : 
                user.role === 'Manager' ? 'status-pending' : 
                'bg-muted text-muted-foreground'
              }`}
            >
              {user.role || 'User'}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              {company?.name || 'Company'}
            </span>
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Admin Access
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AdminDetails;
