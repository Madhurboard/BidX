
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';
import { mockAuctions } from '@/data/mockAuctions';

// Define the auction type with image relationship
export type AuctionWithImage = Tables<'auctions'> & {
  auction_images: Tables<'auction_images'>[] | null;
};

// Define the auction display type
export type AuctionDisplayItem = {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  timeLeft: string;
  bids: number;
  status: 'active' | 'ending-soon' | 'ended';
  image: string;
  isDemo?: boolean;
};

// Define the allowed status types
export type StatusType = 'active' | 'ending-soon' | 'ended' | null;

// Calculate time left helper function
export const getTimeLeft = (endDate: string) => {
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

export const useAuctionsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearchTerm = searchParams.get('search') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [statusFilter, setStatusFilter] = useState<StatusType>(null);
  const [sortOption, setSortOption] = useState('ending-soon');
  const [auctions, setAuctions] = useState<AuctionWithImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDemo, setShowDemo] = useState(true);
  
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
  
  // Fetch auctions from Supabase
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
    
    // Set up real-time subscription for auction updates
    const channel = supabase
      .channel('public:auctions')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'auctions' },
        () => {
          console.log('Auction updated, refreshing data');
          fetchAuctions();
        }
      )
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'auctions' },
        () => {
          console.log('New auction added, refreshing data');
          fetchAuctions();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Process auctions data
  const processAuctions = () => {
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
    
    return sortedAuctions;
  };
  
  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortOption,
    setSortOption,
    showDemo,
    setShowDemo,
    isLoading,
    handleSearch,
    auctions: processAuctions()
  };
};
