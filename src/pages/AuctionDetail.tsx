
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BidHistory from '@/components/BidHistory';

// Import the custom hook and components
import useAuctionDetail from '@/components/auction-detail/hooks/useAuctionDetail';
import AuctionImages from '@/components/auction-detail/AuctionImages';
import AuctionDetails from '@/components/auction-detail/AuctionDetails';
import AuctionStatus from '@/components/auction-detail/AuctionStatus';
import AuctionBidInfo from '@/components/auction-detail/AuctionBidInfo';
import BiddingSection from '@/components/auction-detail/BiddingSection';
import LoadingState from '@/components/auction-detail/LoadingState';
import ErrorState from '@/components/auction-detail/ErrorState';

const AuctionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    auction,
    loading,
    error,
    sellerInfo,
    bids,
    handleBidPlaced,
    handleAuctionEnded
  } = useAuctionDetail(id);
  
  if (loading) {
    return <LoadingState />;
  }
  
  if (error || !auction) {
    return <ErrorState error={error} />;
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
        {/* Left Column - Image and Details */}
        <div className="lg:col-span-2">
          <AuctionImages image={auction.image} title={auction.title} />
          <AuctionDetails description={auction.description} sellerInfo={sellerInfo} />
        </div>
        
        {/* Right Column - Bidding Area */}
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <AuctionStatus 
              status={auction.status} 
              endTime={auction.endTime} 
              onEnd={handleAuctionEnded} 
            />
            
            <h1 className="text-2xl font-bold mb-2">{auction.title}</h1>
            
            <AuctionBidInfo currentBid={auction.currentBid} bidCount={bids.length} />
            
            <BiddingSection
              isAuctionEnded={isAuctionEnded}
              auctionId={auction.id}
              currentBid={auction.currentBid}
              minBidIncrement={auction.minBidIncrement}
              onBidPlaced={handleBidPlaced}
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <BidHistory bids={bids} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;
