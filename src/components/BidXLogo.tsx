
import React from 'react';

const BidXLogo = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative h-8 w-8 mr-2">
        <div className="absolute inset-0 bg-auction-blue rounded-full opacity-80"></div>
        <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
          <span className="text-auction-blue font-bold text-lg">X</span>
        </div>
      </div>
      <span className="text-xl font-bold">BidX</span>
    </div>
  );
};

export default BidXLogo;
