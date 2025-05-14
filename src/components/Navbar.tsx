
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import BidXLogo from './BidXLogo';

const Navbar = () => {
  // Mock authentication state (will be replaced with actual auth)
  const isAuthenticated = false;

  return (
    <header className="border-b sticky top-0 z-50 w-full bg-white">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center">
            <BidXLogo />
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link to="/auctions" className="text-sm font-medium hover:text-auction-blue transition-colors">
              Browse Auctions
            </Link>
            <Link to="/how-it-works" className="text-sm font-medium hover:text-auction-blue transition-colors">
              How It Works
            </Link>
            <Link to="/sell" className="text-sm font-medium hover:text-auction-blue transition-colors">
              Sell Item
            </Link>
          </nav>
        </div>
        
        <div className="hidden md:flex items-center gap-4 md:w-1/3">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search auctions..."
              className="w-full pl-9 rounded-md"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/sell">
                <Button variant="default" className="bg-auction-blue hover:bg-auction-darkBlue">
                  + New Auction
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Log In</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-auction-blue hover:bg-auction-darkBlue">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
