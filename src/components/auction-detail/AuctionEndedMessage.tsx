
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AuctionEndedMessage: React.FC = () => {
  return (
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
  );
};

export default AuctionEndedMessage;
