
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const AuthCallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      setIsLoading(true);
      
      try {
        // Process the session from the URL hash
        const hashParams = window.location.hash;
        
        if (hashParams && hashParams.includes('access_token')) {
          // Let Supabase handle the hash params directly
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }
          
          if (!data.session) {
            throw new Error('No session found');
          }
          
          // Successfully authenticated
          toast({
            title: "Successfully signed in",
            description: "Welcome to BidX!",
          });
        } else {
          // No hash params, attempt to get session anyway
          const { data, error } = await supabase.auth.getSession();
          if (error || !data.session) {
            throw new Error('Authentication failed');
          }
        }
      } catch (err: any) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'Failed to authenticate');
        toast({
          title: "Authentication error",
          description: err.message || "There was a problem signing you in",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-t-auction-blue border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Signing you in...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-xl font-bold text-red-600 mb-2">Authentication Error</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.href = '/auth'}
            className="w-full bg-auction-blue hover:bg-auction-darkBlue text-white font-medium py-2 px-4 rounded"
          >
            Return to login
          </button>
        </div>
      </div>
    );
  }

  // Successful authentication - redirect to home
  return <Navigate to="/" replace />;
};

export default AuthCallback;
