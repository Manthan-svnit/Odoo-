import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { user, signOut } = useAuth();

  return (
    <header className={`flex items-center justify-between px-6 py-4 bg-card/50 backdrop-blur-sm border-b border-border ${className}`}>
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses, receipts..."
            className="pl-10 h-10 rounded-xl focus-ring"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative h-10 w-10 rounded-xl">
              <Bell className="h-5 w-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 glass rounded-xl">
            <DropdownMenuLabel className="text-center">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New expense approval needed</p>
                  <p className="text-xs text-muted-foreground">John Doe submitted $150 expense</p>
                </div>
                <Badge variant="outline" className="status-pending text-xs">
                  Pending
                </Badge>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Expense approved</p>
                  <p className="text-xs text-muted-foreground">Your $75 lunch expense was approved</p>
                </div>
                <Badge variant="outline" className="status-approved text-xs">
                  Approved
                </Badge>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-auto px-3 rounded-xl">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={user?.name} />
                  <AvatarFallback className="gradient-primary text-primary-foreground text-sm font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.role || 'Employee'}</p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass rounded-xl">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-destructive">
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
