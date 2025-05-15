
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-16 h-16 border-4 border-auction-blue border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingState;
