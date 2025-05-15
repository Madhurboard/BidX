import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardHeader } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

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

const MyBids = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeBids, setActiveBids] = useState<AuctionWithBids[]>([]);
  const [pastBids, setPastBids] = useState<AuctionWithBids[]>([]);

  useEffect(() => {
    const fetchBids = async () => {
      if (!user) return;

      setIsLoading(true);

      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          auctions (
            id,
            title,
            end_date,
            current_bid,
            status,
            auction_images (
              image_url
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bids:', error);
        setIsLoading(false);
        return;
      }

      const active: AuctionWithBids[] = [];
      const past: AuctionWithBids[] = [];

      for (const bid of data) {
        const auction = bid.auctions;
        if (!auction) continue;

        const image = auction.auction_images?.[0]?.image_url ?? '/placeholder.svg';

        const bidStatus = determineStatus(bid, auction);

        const item: AuctionWithBids = {
          id: auction.id,
          title: auction.title,
          image_url: image,
          end_date: auction.end_date,
          current_bid: auction.current_bid,
          status: auction.status,
          bid: {
            id: bid.id,
            auction_id: bid.auction_id,
            user_id: bid.user_id,
            amount: bid.amount,
            created_at: bid.created_at,
            status: bidStatus,
          }
        };

        if (auction.status === 'active') {
          active.push(item);
        } else {
          past.push(item);
        }
      }

      setActiveBids(active);
      setPastBids(past);
      setIsLoading(false);
    };

    fetchBids();
  }, [user]);

  const determineStatus = (bid: any, auction: any): Bid['status'] => {
    if (auction.status === 'active') {
      return auction.current_bid === bid.amount ? 'active' : 'outbid';
    }
    return auction.current_bid === bid.amount ? 'won' : 'lost';
  };

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
        return (
          <Badge variant="outline" className="text-orange-500 border-orange-500">
            Outbid
          </Badge>
        );
      case 'won':
        return <Badge className="bg-auction-blue">Won</Badge>;
      case 'lost':
        return (
          <Badge variant="outline" className="text-red-500 border-red-500">
            Lost
          </Badge>
        );
      default:
        return null;
    }
  };

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
              <TableCell>
                {new Date(item.end_date).toLocaleDateString()}
              </TableCell>
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-auction-blue" />
      </div>
    );
  }

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
