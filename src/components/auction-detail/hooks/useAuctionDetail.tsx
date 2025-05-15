
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getMockAuctionDetail } from '@/data/mockAuctions';
import { toast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

type AuctionWithImage = Tables<'auctions'> & {
  auction_images: Tables<'auction_images'>[] | null;
};

type SellerInfo = {
  id: string;
  email?: string;
  fullName?: string;
  rating?: number;
  totalSales?: number;
  joinedDate: string;
};

interface BidType {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  time: string;
  isLatest: boolean;
}

export interface UseAuctionDetailReturn {
  auction: any;
  loading: boolean;
  error: string | null;
  sellerInfo: SellerInfo | null;
  bids: BidType[];
  handleBidPlaced: (amount: number) => void;
  handleAuctionEnded: () => void;
  fetchBids: (auctionId: string) => Promise<void>;
}

export default function useAuctionDetail(id: string | undefined): UseAuctionDetailReturn {
  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null);
  const [bids, setBids] = useState<BidType[]>([]);

  // Function to fetch real-time bids
  const fetchBids = async (auctionId: string) => {
    try {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          id,
          amount,
          created_at,
          user_id,
          profiles(*)
        `)
        .eq('auction_id', auctionId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching bids:', error);
        return;
      }
      
      if (data) {
        // Transform data to match the BidType interface
        const transformedBids = data.map((bid: any, index: number) => ({
          id: bid.id,
          userId: bid.user_id,
          userName: bid.profiles?.full_name || 'Anonymous Bidder',
          amount: parseFloat(bid.amount as any), // Convert from numeric to number
          time: bid.created_at,
          isLatest: index === 0, // First bid is the latest
        }));
        
        setBids(transformedBids);
      }
    } catch (err) {
      console.error('Error in fetchBids:', err);
    }
  };
  
  // Fetch seller information
  const fetchSellerInfo = async (userId: string) => {
    try {
      // Get the user's profile information
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.error('Error fetching seller profile:', profileError);
        return;
      }
      
      // Get the user's authentication information (for email)
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
      
      if (userError) {
        console.error('Error fetching seller auth info:', userError);
      }
      
      setSellerInfo({
        id: userId,
        email: userData?.user?.email,
        fullName: profileData?.full_name || "Seller",
        rating: 4.8, // Default rating for now
        totalSales: 42, // Default sales count for now
        joinedDate: profileData?.created_at || "2023-01-01"
      });
    } catch (err) {
      console.error('Error in fetchSellerInfo:', err);
    }
  };

  useEffect(() => {
    const fetchAuction = async () => {
      setLoading(true);
      setError(null);
      
      if (!id) {
        setError("Auction ID is missing");
        setLoading(false);
        return;
      }
      
      // Check if this is a mock auction from demo data
      if (id.startsWith('mock-')) {
        const mockId = id.replace('mock-', '');
        const auctionDetail = getMockAuctionDetail(mockId);
        
        if (!auctionDetail) {
          setError("Auction not found");
          setLoading(false);
          return;
        }
        
        setAuction(auctionDetail);
        setLoading(false);
        return;
      }
      
      // It's a real auction, fetch from Supabase
      try {
        console.log("Fetching real auction with ID:", id);
        const { data, error: fetchError } = await supabase
          .from('auctions')
          .select('*, auction_images(*)')
          .eq('id', id)
          .single();
        
        if (fetchError) {
          console.error('Error fetching auction:', fetchError);
          setError("Error loading auction");
          setLoading(false);
          return;
        }
        
        if (!data) {
          setError("Auction not found");
          setLoading(false);
          return;
        }
        
        console.log("Fetched auction data:", data);
        
        // Transform Supabase auction data to match the format expected by the component
        const transformedAuction = {
          id: data.id,
          title: data.title,
          description: data.description,
          currentBid: data.current_bid || data.starting_price,
          minBidIncrement: Math.max(10, Math.floor(data.starting_price * 0.05)), // 5% of starting price or at least 10
          status: data.status || 'active',
          endTime: data.end_date,
          seller: {
            id: data.user_id,
            name: "Loading...", // Will be updated by fetchSellerInfo
          },
          image: data.auction_images && data.auction_images.length > 0 
            ? data.auction_images[0].image_url 
            : '/placeholder.svg',
        };
        
        setAuction(transformedAuction);
        
        // Fetch seller information
        await fetchSellerInfo(data.user_id);
        
        // Fetch bids
        await fetchBids(data.id);
        
        setLoading(false);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError("An unexpected error occurred");
        setLoading(false);
      }
    };
    
    fetchAuction();
    
    // Set up real-time subscription for bids
    if (id && !id.startsWith('mock-')) {
      const channel = supabase
        .channel('public:bids')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'bids', filter: `auction_id=eq.${id}` },
          (payload) => {
            console.log('New bid received:', payload);
            // Refresh bids when a new one is added
            fetchBids(id);
            
            // Update current bid in the auction state
            if (payload.new && payload.new.amount) {
              setAuction(prev => ({
                ...prev,
                currentBid: parseFloat(payload.new.amount as any)
              }));
            }
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [id]);

  const handleBidPlaced = (amount: number) => {
    if (!auction) return;
    
    // Update the auction state with the new bid amount
    setAuction({
      ...auction,
      currentBid: amount
    });
    
    // Bids are now fetched automatically through the real-time subscription
  };
  
  const handleAuctionEnded = () => {
    toast({
      title: "Auction has ended",
      description: "This auction is no longer accepting bids.",
      variant: "destructive",
    });
  };

  return {
    auction,
    loading,
    error,
    sellerInfo,
    bids,
    handleBidPlaced,
    handleAuctionEnded,
    fetchBids
  };
}
