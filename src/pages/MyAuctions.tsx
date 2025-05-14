
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Link } from 'react-router-dom';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type AuctionWithImage = Tables<'auctions'> & {
  auction_images: Tables<'auction_images'>[] | null;
};

const MyAuctions = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeAuctions, setActiveAuctions] = useState<AuctionWithImage[]>([]);
  const [completedAuctions, setCompletedAuctions] = useState<AuctionWithImage[]>([]);
  
  useEffect(() => {
    const fetchAuctions = async () => {
      if (!user) return;
      
      try {
        const { data: active, error: activeError } = await supabase
          .from('auctions')
          .select('*, auction_images(*)')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false });
        
        if (activeError) throw activeError;
        
        const { data: completed, error: completedError } = await supabase
          .from('auctions')
          .select('*, auction_images(*)')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false });
        
        if (completedError) throw completedError;
        
        setActiveAuctions(active as AuctionWithImage[]);
        setCompletedAuctions(completed as AuctionWithImage[]);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAuctions();
  }, [user]);
  
  const getFirstImageUrl = (auction: AuctionWithImage) => {
    if (auction.auction_images && auction.auction_images.length > 0) {
      return auction.auction_images[0].image_url;
    }
    return '/placeholder.svg';
  };
  
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '—';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-auction-blue" />
      </div>
    );
  }
  
  const renderAuctionTable = (auctions: AuctionWithImage[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Auction</TableHead>
          <TableHead>Start Price</TableHead>
          <TableHead>Current Bid</TableHead>
          <TableHead>Bids</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {auctions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6">
              No auctions found
            </TableCell>
          </TableRow>
        ) : (
          auctions.map((auction) => (
            <TableRow key={auction.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img 
                    src={getFirstImageUrl(auction)} 
                    alt={auction.title}
                    className="h-10 w-10 object-cover rounded"
                  />
                  <span className="font-medium">{auction.title}</span>
                </div>
              </TableCell>
              <TableCell>{formatCurrency(auction.starting_price)}</TableCell>
              <TableCell>{formatCurrency(auction.current_bid)}</TableCell>
              <TableCell>{auction.bids_count}</TableCell>
              <TableCell>{new Date(auction.end_date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/auction/${auction.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Auctions</h1>
        <Button asChild>
          <Link to="/sell">
            <Plus className="mr-2 h-4 w-4" /> New Auction
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <Tabs defaultValue="active" className="w-full">
            <TabsList>
              <TabsTrigger value="active">Active ({activeAuctions.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedAuctions.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-4">
              {renderAuctionTable(activeAuctions)}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-4">
              {renderAuctionTable(completedAuctions)}
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
};

export default MyAuctions;
