
import React, { useState, useEffect } from 'react';
import AuctionCard from '@/components/AuctionCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';
import { mockAuctions } from '@/data/mockAuctions';
import { useSearchParams } from 'react-router-dom';

type AuctionWithImage = Tables<'auctions'> & {
  auction_images: Tables<'auction_images'>[] | null;
};

// Define the allowed status types
type StatusType = 'active' | 'ending-soon' | 'ended' | null;

const AuctionsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearchTerm = searchParams.get('search') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [statusFilter, setStatusFilter] = useState<StatusType>(null);
  const [sortOption, setSortOption] = useState('ending-soon');
  const [auctions, setAuctions] = useState<AuctionWithImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDemo, setShowDemo] = useState(true); // State to toggle demo auctions
  
  // Update search term when URL parameter changes
  useEffect(() => {
    const searchFromUrl = searchParams.get('search') || '';
    setSearchTerm(searchFromUrl);
  }, [searchParams]);
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ search: searchTerm.trim() });
    } else {
      setSearchParams({});
    }
  };
  
  useEffect(() => {
    const fetchAuctions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('auctions')
          .select('*, auction_images(*)')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching auctions:', error);
          toast({
            title: "Error fetching auctions",
            description: error.message,
            variant: "destructive",
          });
          setAuctions([]);
        } else {
          setAuctions(data as AuctionWithImage[]);
        }
      } catch (error) {
        console.error('Error in auction fetch:', error);
        setAuctions([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAuctions();
  }, []);
  
  // Combine real and demo auctions if showDemo is true
  const combinedAuctions = showDemo 
    ? [
        ...auctions.map(auction => ({
          id: auction.id,
          title: auction.title,
          description: auction.description,
          currentBid: auction.current_bid || auction.starting_price,
          timeLeft: getTimeLeft(auction.end_date),
          bids: auction.bids_count,
          status: auction.status as 'active' | 'ending-soon' | 'ended',
          image: auction.auction_images && auction.auction_images.length > 0 
                 ? auction.auction_images[0].image_url 
                 : '/placeholder.svg',
          isDemo: false
        })),
        ...mockAuctions.map(auction => ({
          ...auction,
          isDemo: true
        }))
      ]
    : auctions.map(auction => ({
        id: auction.id,
        title: auction.title,
        description: auction.description,
        currentBid: auction.current_bid || auction.starting_price,
        timeLeft: getTimeLeft(auction.end_date),
        bids: auction.bids_count,
        status: auction.status as 'active' | 'ending-soon' | 'ended',
        image: auction.auction_images && auction.auction_images.length > 0 
               ? auction.auction_images[0].image_url 
               : '/placeholder.svg',
        isDemo: false
      }));
  
  // Filter auctions based on search term and status
  const filteredAuctions = combinedAuctions.filter(auction => {
    const matchesSearch = auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          auction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? auction.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort auctions based on selected option
  const sortedAuctions = [...filteredAuctions].sort((a, b) => {
    switch (sortOption) {
      case 'ending-soon':
        return a.status === 'ended' ? 1 : b.status === 'ended' ? -1 : 0;
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-auction-blue" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Browse Auctions</h1>
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search auctions..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button 
                  type="submit" 
                  className="absolute right-1 top-1 h-8"
                  variant="ghost"
                >
                  Search
                </Button>
              </form>
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
          
          <div className="flex justify-between items-center mb-4">
            <Tabs defaultValue="all" className="w-full" onValueChange={(value) => {
              // Convert the value to a type-safe StatusType
              const statusValue = value === "all" 
                ? null 
                : (value as StatusType);
              setStatusFilter(statusValue);
            }}>
              <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="ending-soon">Ending Soon</TabsTrigger>
              </TabsList>
            </Tabs>
            
          
          </div>
        </div>
        
        {sortedAuctions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedAuctions.map((auction) => (
              <AuctionCard 
                key={auction.id + (auction.isDemo ? '-demo' : '')} 
                auction={{
                  id: auction.id,
                  title: auction.title,
                  description: auction.description,
                  currentBid: auction.currentBid,
                  timeLeft: auction.timeLeft,
                  bids: auction.bids,
                  status: auction.status,
                  image: auction.image,
                  isDemo: auction.isDemo
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-medium mb-2">No auctions found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find any auctions matching your search criteria.
            </p>
            <Button onClick={() => { 
              setSearchTerm(''); 
              setStatusFilter(null);
              setSearchParams({}); 
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to calculate time left
const getTimeLeft = (endDate: string) => {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return 'Ended';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h left`;
  } else if (hours > 0) {
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m left`;
  } else {
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${minutes}m left`;
  }
};

export default AuctionsList;
