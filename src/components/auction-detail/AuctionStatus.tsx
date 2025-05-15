
import React from 'react';
import { Badge } from '@/components/ui/badge';
import CountdownTimer from '@/components/CountdownTimer';

interface AuctionStatusProps {
  status: string;
  endTime: string;
  onEnd: () => void;
}

const AuctionStatus: React.FC<AuctionStatusProps> = ({ status, endTime, onEnd }) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <Badge 
        className={
          status === 'active' ? "bg-auction-green" :
          status === 'ending-soon' ? "bg-auction-yellow text-black" :
          "bg-gray-500"
        }
      >
        {status === 'active' ? "Active" : 
         status === 'ending-soon' ? "Ending Soon" :
         "Ended"}
      </Badge>
      
      <div className="flex items-center">
        <span className="text-sm text-muted-foreground mr-2">Time left:</span>
        <CountdownTimer 
          endTime={endTime} 
          onEnd={onEnd}
        />
      </div>
    </div>
  );
};

export default AuctionStatus;
