
import React from 'react';
import { Bell, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NavbarProps {
  onSearchChange: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearchChange }) => {
  return (
    <nav className="bg-white shadow-sm py-4 px-6 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">SubTrack</h1>
          <div className="hidden md:flex ml-8 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search subscriptions..."
              className="pl-10 w-64"
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="md:hidden mt-4 relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search subscriptions..."
          className="pl-10 w-full"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </nav>
  );
};

export default Navbar;
