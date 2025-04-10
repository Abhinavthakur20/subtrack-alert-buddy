
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, Search, LogOut, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from '@/hooks/use-toast';

interface NavbarProps {
  onSearchChange: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearchChange }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  return (
    <nav className="bg-background border-b border-border py-4 px-6 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <h1 className="text-2xl font-bold text-primary">SubTrack</h1>
          </Link>
          {isAuthenticated && (
            <div className="hidden md:flex ml-8 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search subscriptions..."
                className="pl-10 w-64"
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <>
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user?.name || 'My Account'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate('/login')}>
                <LogIn className="mr-2 h-4 w-4" />
                Sign in
              </Button>
              <Button onClick={() => navigate('/signup')}>
                <UserPlus className="mr-2 h-4 w-4" />
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
      {isAuthenticated && (
        <div className="md:hidden mt-4 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search subscriptions..."
            className="pl-10 w-full"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
