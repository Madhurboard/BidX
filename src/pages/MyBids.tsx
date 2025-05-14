
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardHeader } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// This would normally come from the database schema, but we're creating a simple type for now
type Bid = {
  id: string;
  auction_id: string;
  user_id: string;
  amount: number;
  created_at: string;
  status: 'active' | 'won' | 'outbid' | 'lost';
};

type AuctionWithBids = {
  id: string;
  title: string;
  image_url: string;
  end_date: string;
  current_bid: number | null;
  status: string;
  bid: Bid;
};

// For now we're using mock data, but this would be replaced with actual data from Supabase
const MyBids = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeBids, setActiveBids] = useState<AuctionWithBids[]>([]);
  const [pastBids, setPastBids] = useState<AuctionWithBids[]>([]);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      // In a real implementation, we would fetch bids from Supabase
      // For now, we're using mock data
      setActiveBids([
        {
          id: '1',
          title: 'Vintage Camera',
          image_url: '/placeholder.svg',
          end_date: new Date(Date.now() + 3600000 * 24 * 3).toISOString(),
          current_bid: 15000,
          status: 'active',
          bid: {
            id: '101',
            auction_id: '1',
            user_id: user?.id || '',
            amount: 15000,
            created_at: new Date().toISOString(),
            status: 'active'
          }
        },
        {
          id: '2',
          title: 'Antique Watch',
          image_url: '/placeholder.svg',
          end_date: new Date(Date.now() + 3600000 * 24 * 5).toISOString(),
          current_bid: 8500,
          status: 'active',
          bid: {
            id: '102',
            auction_id: '2',
            user_id: user?.id || '',
            amount: 8000,
            created_at: new Date().toISOString(),
            status: 'outbid'
          }
        }
      ]);
      
      setPastBids([
        {
          id: '3',
          title: 'Rare Coin Collection',
          image_url: '/placeholder.svg',
          end_date: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
          current_bid: 25000,
          status: 'completed',
          bid: {
            id: '103',
            auction_id: '3',
            user_id: user?.id || '',
            amount: 25000,
            created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
            status: 'won'
          }
        },
        {
          id: '4',
          title: 'Vinyl Record Set',
          image_url: '/placeholder.svg',
          end_date: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
          current_bid: 12000,
          status: 'completed',
          bid: {
            id: '104',
            auction_id: '4',
            user_id: user?.id || '',
            amount: 11500,
            created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
            status: 'lost'
          }
        }
      ]);
      
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [user]);
  
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '—';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };
  
  const getBidStatusBadge = (status: Bid['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Highest Bid</Badge>;
      case 'outbid':
        return <Badge variant="outline" className="text-orange-500 border-orange-500">Outbid</Badge>;
      case 'won':
        return <Badge className="bg-auction-blue">Won</Badge>;
      case 'lost':
        return <Badge variant="outline" className="text-red-500 border-red-500">Lost</Badge>;
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-auction-blue" />
      </div>
    );
  }
  
  const renderBidsTable = (bids: AuctionWithBids[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Auction</TableHead>
          <TableHead>Your Bid</TableHead>
          <TableHead>Current Price</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bids.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6">
              No bids found
            </TableCell>
          </TableRow>
        ) : (
          bids.map((item) => (
            <TableRow key={item.bid.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="h-10 w-10 object-cover rounded"
                  />
                  <span className="font-medium">{item.title}</span>
                </div>
              </TableCell>
              <TableCell>{formatCurrency(item.bid.amount)}</TableCell>
              <TableCell>{formatCurrency(item.current_bid)}</TableCell>
              <TableCell>{new Date(item.end_date).toLocaleDateString()}</TableCell>
              <TableCell>{getBidStatusBadge(item.bid.status)}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/auction/${item.id}`}>View</Link>
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
        <h1 className="text-2xl font-bold">My Bids</h1>
        <Button variant="outline" asChild>
          <Link to="/auctions">Browse Auctions</Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <Tabs defaultValue="active" className="w-full">
            <TabsList>
              <TabsTrigger value="active">Active Bids ({activeBids.length})</TabsTrigger>
              <TabsTrigger value="past">Past Bids ({pastBids.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-4">
              {renderBidsTable(activeBids)}
            </TabsContent>
            
            <TabsContent value="past" className="mt-4">
              {renderBidsTable(pastBids)}
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
};

export default MyBids;
