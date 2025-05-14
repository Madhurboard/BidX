
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface Bid {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  time: string;
  isLatest: boolean;
}

interface BidHistoryProps {
  bids: Bid[];
}

const BidHistory: React.FC<BidHistoryProps> = ({ bids }) => {
  return (
    <div className="rounded-md border">
      <div className="p-4 border-b">
        <h3 className="font-medium">Bid History</h3>
      </div>
      <ScrollArea className="h-[300px]">
        {bids.length > 0 ? (
          <div>
            {bids.map((bid) => (
              <div key={bid.id} className={`bid-history-item ${bid.isLatest ? 'latest' : ''}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{bid.userName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(bid.time).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <p className="font-bold text-auction-blue">₹{bid.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No bids yet. Be the first to bid!
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default BidHistory;
