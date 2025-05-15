
import React from 'react';

interface AuctionBidInfoProps {
  currentBid: number;
  bidCount: number;
}

const AuctionBidInfo: React.FC<AuctionBidInfoProps> = ({ currentBid, bidCount }) => {
  return (
    <div className="mb-6">
      <p className="text-sm text-muted-foreground">Current Bid</p>
      <p className="text-3xl font-bold text-auction-blue">
        ₹{currentBid.toLocaleString()}
      </p>
      <p className="text-sm text-muted-foreground">
        {bidCount} bid{bidCount !== 1 ? 's' : ''}
      </p>
    </div>
  );
};

export default AuctionBidInfo;
