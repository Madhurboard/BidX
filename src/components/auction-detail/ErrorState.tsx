
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  error: string | null;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-auction-red" />
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-lg mb-6">{error || "An unknown error occurred"}</p>
        <Link to="/auctions">
          <Button>Browse Other Auctions</Button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorState;
