
import React, { useState } from 'react';
import AuctionCard from '@/components/AuctionCard';
import { mockAuctions } from '@/data/mockAuctions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';

const AuctionsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState('ending-soon');
  
  // Filter auctions based on search term and status
  const filteredAuctions = mockAuctions.filter(auction => {
    const matchesSearch = auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          auction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? auction.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort auctions based on selected option
  const sortedAuctions = [...filteredAuctions].sort((a, b) => {
    switch (sortOption) {
      case 'ending-soon':
        // Sort by ending soon (assume we're using the timeLeft string - in a real app we'd use actual dates)
        return a.status === 'ending-soon' ? -1 : b.status === 'ending-soon' ? 1 : 0;
      case 'price-low':
        return a.currentBid - b.currentBid;
      case 'price-high':
        return b.currentBid - a.currentBid;
      case 'most-bids':
        return b.bids - a.bids;
      default:
        return 0;
    }
  });
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Browse Auctions</h1>
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search auctions..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ending-soon">Ending Soon</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="most-bids">Most Bids</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setStatusFilter(value === 'all' ? null : value)}>
            <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="ending-soon">Ending Soon</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {sortedAuctions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-medium mb-2">No auctions found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find any auctions matching your search criteria.
            </p>
            <Button onClick={() => { setSearchTerm(''); setStatusFilter(null); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionsList;
