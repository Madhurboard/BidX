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
import { ChevronLeft, User, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type AuctionWithImage = Tables<'auctions'> & {
  auction_images: Tables<'auction_images'>[] | null;
};

const AuctionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
            name: "Seller", // We'll improve this later with profile data
            rating: 4.8,
            totalSales: 42,
            joinedDate: "2023-01-01"
          },
          bids: [], // We'll improve this later with actual bids
          image: data.auction_images && data.auction_images.length > 0 
            ? data.auction_images[0].image_url 
            : '/placeholder.svg',
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
  
  const handleBidPlaced = (amount: number) => {
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
                    <h3 className="font-medium">{auction.seller.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="flex items-center mr-3">
                        <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        {auction.seller.rating} rating
                      </span>
                      <span>{auction.seller.totalSales} sales</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Member since {new Date(auction.seller.joinedDate).toLocaleDateString('en-US', {
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
