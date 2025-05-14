
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Link } from 'react-router-dom';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type AuctionWithImage = Tables<'auctions'> & {
  auction_images: Tables<'auction_images'>[] | null;
};

const MyAuctions = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [activeAuctions, setActiveAuctions] = useState<AuctionWithImage[]>([]);
  const [completedAuctions, setCompletedAuctions] = useState<AuctionWithImage[]>([]);
  
  const fetchAuctions = async () => {
    if (!user) return;
    
    try {
      const { data: active, error: activeError } = await supabase
        .from('auctions')
        .select('*, auction_images(*)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (activeError) throw activeError;
      
      const { data: completed, error: completedError } = await supabase
        .from('auctions')
        .select('*, auction_images(*)')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });
      
      if (completedError) throw completedError;
      
      setActiveAuctions(active as AuctionWithImage[]);
      setCompletedAuctions(completed as AuctionWithImage[]);
    } catch (error) {
      console.error('Error fetching auctions:', error);
      toast({
        title: "Error fetching auctions",
        description: "There was a problem loading your auctions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAuctions();
  }, [user]);
  
  const handleDeleteAuction = async (auctionId: string) => {
    if (!user) return;
    
    try {
      setIsDeleting(auctionId);
      
      // Delete auction images first (due to foreign key constraint)
      const { error: imagesError } = await supabase
        .from('auction_images')
        .delete()
        .eq('auction_id', auctionId);
        
      if (imagesError) throw imagesError;
      
      // Delete the auction
      const { error: auctionError } = await supabase
        .from('auctions')
        .delete()
        .eq('id', auctionId)
        .eq('user_id', user.id);
        
      if (auctionError) throw auctionError;
      
      // Update the UI by removing the deleted auction
      setActiveAuctions(prev => prev.filter(a => a.id !== auctionId));
      setCompletedAuctions(prev => prev.filter(a => a.id !== auctionId));
      
      toast({
        title: "Auction deleted",
        description: "Your auction has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting auction:', error);
      toast({
        title: "Error deleting auction",
        description: "There was a problem deleting your auction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };
  
  const getFirstImageUrl = (auction: AuctionWithImage) => {
    if (auction.auction_images && auction.auction_images.length > 0) {
      return auction.auction_images[0].image_url;
    }
    return '/placeholder.svg';
  };
  
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '—';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-auction-blue" />
      </div>
    );
  }
  
  const renderAuctionTable = (auctions: AuctionWithImage[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Auction</TableHead>
          <TableHead>Start Price</TableHead>
          <TableHead>Current Bid</TableHead>
          <TableHead>Bids</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {auctions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6">
              No auctions found
            </TableCell>
          </TableRow>
        ) : (
          auctions.map((auction) => (
            <TableRow key={auction.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img 
                    src={getFirstImageUrl(auction)} 
                    alt={auction.title}
                    className="h-10 w-10 object-cover rounded"
                  />
                  <span className="font-medium">{auction.title}</span>
                </div>
              </TableCell>
              <TableCell>{formatCurrency(auction.starting_price)}</TableCell>
              <TableCell>{formatCurrency(auction.current_bid)}</TableCell>
              <TableCell>{auction.bids_count}</TableCell>
              <TableCell>{new Date(auction.end_date).toLocaleDateString()}</TableCell>
              <TableCell className="space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/auction/${auction.id}`}>View</Link>
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Auction</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this auction? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteAuction(auction.id)}
                        className="bg-red-500 hover:bg-red-600"
                        disabled={isDeleting === auction.id}
                      >
                        {isDeleting === auction.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          'Delete'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Auctions</h1>
        <Button asChild>
          <Link to="/sell">
            <Plus className="mr-2 h-4 w-4" /> New Auction
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <Tabs defaultValue="active" className="w-full">
            <TabsList>
              <TabsTrigger value="active">Active ({activeAuctions.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedAuctions.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-4">
              {renderAuctionTable(activeAuctions)}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-4">
              {renderAuctionTable(completedAuctions)}
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
};

export default MyAuctions;
