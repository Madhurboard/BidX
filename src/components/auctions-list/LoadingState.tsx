
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-auction-blue" />
      </div>
    </div>
  );
};

export default LoadingState;
