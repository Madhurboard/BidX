
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  bids: number;
  timeLeft: string;
  image: string;
  status: 'active' | 'ending-soon' | 'ended';
  isDemo?: boolean;
}

interface AuctionCardProps {
  auction: AuctionItem;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction }) => {
  const getStatusBadge = () => {
    switch (auction.status) {
      case 'active':
        return <Badge className="bg-auction-green">Active</Badge>;
      case 'ending-soon':
        return <Badge className="bg-auction-yellow text-black">Ending Soon</Badge>;
      case 'ended':
        return <Badge variant="outline" className="border-auction-red text-auction-red">Ended</Badge>;
      default:
        return null;
    }
  };
  
  // For demo auctions, prefix the id with 'mock-'
  const auctionLinkId = auction.isDemo ? `mock-${auction.id}` : auction.id;

  return (
    <Card className="auction-card h-full flex flex-col">
      <div className="relative">
        <div className="absolute top-2 right-2">
          {getStatusBadge()}
        </div>
        <img 
          src={auction.image} 
          alt={auction.title} 
          className="h-48 w-full object-cover"
        />
      </div>
      <CardContent className="p-4 flex-grow">
        <h3 className="text-lg font-semibold line-clamp-1">{auction.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{auction.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Current Bid</p>
            <p className="text-lg font-bold text-auction-blue">₹{auction.currentBid.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Time Left</p>
            <p className="text-sm countdown-timer">{auction.timeLeft}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{auction.bids} bid(s)</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/auction/${auctionLinkId}`} className="w-full">
          <Button 
            variant="default" 
            className="w-full bg-auction-blue hover:bg-auction-darkBlue"
          >
            View Auction
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default AuctionCard;
