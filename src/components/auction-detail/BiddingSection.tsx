
import React from 'react';
import { Separator } from '@/components/ui/separator';
import PlaceBid from '@/components/PlaceBid';
import AuctionEndedMessage from './AuctionEndedMessage';

interface BiddingSectionProps {
  isAuctionEnded: boolean;
  auctionId: string;
  currentBid: number;
  minBidIncrement: number;
  onBidPlaced: (amount: number) => void;
}

const BiddingSection: React.FC<BiddingSectionProps> = ({
  isAuctionEnded,
  auctionId,
  currentBid,
  minBidIncrement,
  onBidPlaced
}) => {
  return (
    <>
      <Separator className="my-6" />
      
      {isAuctionEnded ? (
        <AuctionEndedMessage />
      ) : (
        <PlaceBid 
          auctionId={auctionId}
          currentBid={currentBid}
          minBidIncrement={minBidIncrement}
          onBidPlaced={onBidPlaced}
        />
      )}
    </>
  );
};

export default BiddingSection;
