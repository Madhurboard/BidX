
import React from 'react';

const BidXLogo = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/uploads/logo.png" 
        alt="BidX Logo" 
        className="h-8 md:h-10"
      />
    </div>
  );
};

export default BidXLogo;
