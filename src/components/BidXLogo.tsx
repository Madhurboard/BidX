
import React from 'react';

const BidXLogo = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/ac8496e0-469f-4a81-88f8-51632950c61e.png" 
        alt="BidX Logo" 
        className="h-8 md:h-10"
      />
    </div>
  );
};

export default BidXLogo;
