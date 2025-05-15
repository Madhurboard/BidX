
import React from 'react';
import AuctionCard from '@/components/AuctionCard';
import { Button } from '@/components/ui/button';
import { AuctionDisplayItem } from '@/hooks/useAuctionsList';

interface AuctionGridProps {
  auctions: AuctionDisplayItem[];
  onClearFilters: () => void;
}

const AuctionGrid: React.FC<AuctionGridProps> = ({ auctions, onClearFilters }) => {
  if (auctions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <h3 className="text-xl font-medium mb-2">No auctions found</h3>
        <p className="text-muted-foreground mb-6">
          We couldn't find any auctions matching your search criteria.
        </p>
        <Button onClick={onClearFilters}>
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {auctions.map((auction) => (
        <AuctionCard 
          key={auction.id + (auction.isDemo ? '-demo' : '')} 
          auction={{
            id: auction.id,
            title: auction.title,
            description: auction.description,
            currentBid: auction.currentBid,
            timeLeft: auction.timeLeft,
            bids: auction.bids,
            status: auction.status,
            image: auction.image,
            isDemo: auction.isDemo
          }} 
        />
      ))}
    </div>
  );
};

export default AuctionGrid;
