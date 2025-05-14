
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface PlaceBidProps {
  auctionId: string;
  currentBid: number;
  minBidIncrement: number;
  onBidPlaced: (amount: number) => void;
}

const PlaceBid: React.FC<PlaceBidProps> = ({ 
  auctionId, 
  currentBid, 
  minBidIncrement, 
  onBidPlaced 
}) => {
  const [bidAmount, setBidAmount] = useState<string>((currentBid + minBidIncrement).toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const suggestedBids = [
    currentBid + minBidIncrement,
    currentBid + (minBidIncrement * 2),
    currentBid + (minBidIncrement * 5)
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(bidAmount);
    
    if (isNaN(amount)) {
      toast({
        title: "Invalid bid amount",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }
    
    if (amount <= currentBid) {
      toast({
        title: "Bid too low",
        description: `Your bid must be higher than the current bid of ₹${currentBid.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }
    
    if (amount < currentBid + minBidIncrement) {
      toast({
        title: "Bid increment too small",
        description: `Minimum bid increment is ₹${minBidIncrement.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call to place bid
    setTimeout(() => {
      onBidPlaced(amount);
      toast({
        title: "Bid placed successfully!",
        description: `You've placed a bid of ₹${amount.toLocaleString()}`,
      });
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <div className="border rounded-md p-4">
      <h3 className="font-medium mb-4">Place a Bid</h3>
      <p className="text-sm text-muted-foreground mb-2">
        Current bid: <span className="font-medium text-foreground">₹{currentBid.toLocaleString()}</span>
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        Minimum bid: <span className="font-medium text-foreground">₹{(currentBid + minBidIncrement).toLocaleString()}</span>
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {suggestedBids.map((amount, i) => (
          <Button
            key={i}
            variant="outline"
            onClick={() => setBidAmount(amount.toString())}
            className="flex-grow"
          >
            ₹{amount.toLocaleString()}
          </Button>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 mb-2">
          <div className="relative flex-grow">
            <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
            <Input
              type="number"
              min={currentBid + minBidIncrement}
              step="0.01"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="pl-7"
              required
            />
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="bg-auction-green hover:bg-auction-green/90"
          >
            {isSubmitting ? "Placing Bid..." : "Place Bid"}
          </Button>
        </div>
      </form>
      <p className="text-xs text-muted-foreground">
        By placing a bid, you agree to our terms & conditions
      </p>
    </div>
  );
};

export default PlaceBid;
