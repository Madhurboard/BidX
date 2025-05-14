
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, User, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import BidXLogo from './BidXLogo';
import { useAuth } from './AuthProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const isAuthenticated = !!user;
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/auctions?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/auctions');
    }
  };

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
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search auctions..."
              className="w-full pl-9 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-auctions" className="cursor-pointer">My Auctions</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-bids" className="cursor-pointer">My Bids</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link to="/sell">
                <Button variant="default" className="bg-auction-blue hover:bg-auction-darkBlue">
                  + New Auction
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline">Log In</Button>
              </Link>
              <Link to="/auth">
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
