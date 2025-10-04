import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus,
  FileText,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import ExpenseFlowLogo from '@/components/ExpenseFlowLogo';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { signOut, user } = useAuth();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: true,
    },
    {
      name: 'Add Expense',
      href: '/expenses/new',
      icon: Plus,
      current: false,
    },
    {
      name: 'My Expenses',
      href: '/expenses',
      icon: Receipt,
      current: false,
    },
    {
      name: 'Approvals',
      href: '/approvals',
      icon: CheckCircle,
      current: false,
      badge: '4', // Pending approvals count
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: Users,
      current: false,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      current: false,
    },
  ];

  return (
    <div className={`flex flex-col h-full bg-sidebar-background border-r border-sidebar-border ${className}`}>
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-sidebar-border">
        <ExpenseFlowLogo size="sm" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground glow-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`
              }
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <Badge 
                  variant="secondary" 
                  className="bg-primary/20 text-primary text-xs px-2 py-0.5"
                >
                  {item.badge}
                </Badge>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.role || 'Employee'}
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
