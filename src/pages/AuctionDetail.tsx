
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMockAuctionDetail } from '@/data/mockAuctions';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import BidHistory from '@/components/BidHistory';
import PlaceBid from '@/components/PlaceBid';
import CountdownTimer from '@/components/CountdownTimer';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ChevronLeft, User, AlertCircle, Mail, Star, ShoppingBag, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type AuctionWithImage = Tables<'auctions'> & {
  auction_images: Tables<'auction_images'>[] | null;
};

type SellerInfo = {
  id: string;
  email?: string;
  name: string;
  rating: number;
  totalSales: number;
  joinedDate: string;
};

const AuctionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null);
  
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
        setSellerInfo(auctionDetail.seller);
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
        
        // Fetch seller information from auth.users
        let sellerData: SellerInfo = {
          id: data.user_id,
          name: "Seller", 
          rating: 4.8,
          totalSales: 42,
          joinedDate: "2023-01-01"
        };

        // Try to get more seller information from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user_id)
          .single();
        
        if (!profileError && profileData) {
          sellerData.name = profileData.full_name || profileData.username || "Seller";
        }
        
        // Get user email - this requires special authorization, so we'll just simulate it for demo
        try {
          const { data: userData } = await supabase.auth.admin.getUserById(data.user_id);
          if (userData?.user) {
            sellerData.email = userData.user.email;
          }
        } catch (e) {
          console.log("Could not fetch user email - admin privileges required");
          // For demonstration purposes, we'll provide a mock email
          sellerData.email = "seller@example.com";
        }
        
        setSellerInfo(sellerData);
        
        // Transform Supabase auction data to match the format expected by the component
        const transformedAuction = {
          id: data.id,
          title: data.title,
          description: data.description,
          currentBid: data.current_bid || data.starting_price,
          minBidIncrement: Math.max(10, Math.floor(data.starting_price * 0.05)), // 5% of starting price or at least 10
          status: data.status || 'active',
          endTime: data.end_date,
          seller: sellerData,
          bids: [], // We'll improve this later with actual bids
          image: data.auction_images && data.auction_images.length > 0 
            ? data.auction_images[0].image_url 
            : '/placeholder.svg',
          isDemo: false,
        };
        
        setAuction(transformedAuction);
        setLoading(false);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError("An unexpected error occurred");
        setLoading(false);
      }
    };
    
    fetchAuction();
  }, [id]);
  
  const handleBidPlaced = async (amount: number) => {
    if (!auction) return;
    
    // Create a new bid
    const newBid = {
      id: `bid-${Date.now()}`,
      userId: 'current-user',
      userName: 'You',
      amount: amount,
      time: new Date().toISOString(),
      isLatest: true
    };
    
    // Update all other bids to not be the latest
    const updatedBids = auction.bids.map((bid: any) => ({
      ...bid,
      isLatest: false
    }));
    
    // Add new bid to the list
    updatedBids.push(newBid);
    
    // Sort bids by time (oldest first)
    updatedBids.sort((a: any, b: any) => 
      new Date(a.time).getTime() - new Date(b.time).getTime()
    );
    
    // Update auction state
    setAuction({
      ...auction,
      currentBid: amount,
      bids: updatedBids
    });
  };
  
  const handleAuctionEnded = () => {
    toast({
      title: "Auction has ended",
      description: "This auction is no longer accepting bids.",
      variant: "destructive",
    });
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-16 h-16 border-4 border-auction-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error || !auction) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-auction-red" />
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-lg mb-6">{error || "An unknown error occurred"}</p>
          <Link to="/auctions">
            <Button>Browse Other Auctions</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const isAuctionEnded = auction.status === 'ended';
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/auctions" className="flex items-center text-sm text-muted-foreground hover:text-auction-blue">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to auctions
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Image */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img 
              src={auction.image} 
              alt={auction.title} 
              className="w-full h-[400px] object-cover"
            />
          </div>
          
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="seller">Seller Information</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-6">
                <h3 className="text-lg font-medium mb-3">Item Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">{auction.description}</p>
              </TabsContent>
              <TabsContent value="seller" className="mt-6">
                <div className="flex items-center mb-4">
                  <div className="bg-auction-blue/10 rounded-full h-12 w-12 flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-auction-blue" />
                  </div>
                  <div>
                    <h3 className="font-medium">{sellerInfo?.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="flex items-center mr-3">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        {sellerInfo?.rating} rating
                      </span>
                      <span className="flex items-center">
                        <ShoppingBag className="w-3 h-3 mr-1" />
                        {sellerInfo?.totalSales} sales
                      </span>
                    </div>
                  </div>
                </div>
                {sellerInfo?.email && (
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{sellerInfo.email}</span>
                  </div>
                )}
                <p className="flex items-center text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  Member since {new Date(sellerInfo?.joinedDate || '').toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <Button variant="outline" className="w-full">Contact Seller</Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Right Column - Bidding Area */}
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <Badge 
                className={
                  auction.status === 'active' ? "bg-auction-green" :
                  auction.status === 'ending-soon' ? "bg-auction-yellow text-black" :
                  "bg-gray-500"
                }
              >
                {auction.status === 'active' ? "Active" : 
                 auction.status === 'ending-soon' ? "Ending Soon" :
                 "Ended"}
              </Badge>
              
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground mr-2">Time left:</span>
                <CountdownTimer 
                  endTime={auction.endTime} 
                  onEnd={handleAuctionEnded}
                />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-2">{auction.title}</h1>
            
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">Current Bid</p>
              <p className="text-3xl font-bold text-auction-blue">
                ₹{auction.currentBid.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                {auction.bids ? auction.bids.length : 0} bid{auction.bids && auction.bids.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <Separator className="my-6" />
            
            {isAuctionEnded ? (
              <div className="bg-gray-50 p-4 rounded-lg border text-center">
                <h3 className="font-medium mb-1">Auction Ended</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This auction is no longer accepting bids.
                </p>
                <Link to="/auctions">
                  <Button variant="outline" className="w-full">
                    Browse Other Auctions
                  </Button>
                </Link>
              </div>
            ) : (
              <PlaceBid 
                auctionId={auction.id}
                currentBid={auction.currentBid}
                minBidIncrement={auction.minBidIncrement}
                onBidPlaced={handleBidPlaced}
                isDemo={auction.isDemo || id?.startsWith('mock-')}
              />
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <BidHistory bids={auction.bids || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;
