
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { User, Mail } from 'lucide-react';

interface AuctionDetailsProps {
  description: string;
  sellerInfo: {
    id: string;
    email?: string;
    fullName?: string;
    rating?: number;
    totalSales?: number;
    joinedDate: string;
  } | null;
}

const AuctionDetails: React.FC<AuctionDetailsProps> = ({ description, sellerInfo }) => {
  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="seller">Seller Information</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-6">
          <h3 className="text-lg font-medium mb-3">Item Description</h3>
          <p className="text-muted-foreground whitespace-pre-line">{description}</p>
        </TabsContent>
        <TabsContent value="seller" className="mt-6">
          <div className="flex items-center mb-4">
            <div className="bg-auction-blue/10 rounded-full h-12 w-12 flex items-center justify-center mr-4">
              <User className="h-6 w-6 text-auction-blue" />
            </div>
            <div>
              <h3 className="font-medium">{sellerInfo?.fullName || 'Seller'}</h3>
              {sellerInfo?.email && (
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Mail className="w-4 h-4 mr-1" />
                  <span>{sellerInfo.email}</span>
                </div>
              )}
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <span className="flex items-center mr-3">
                  <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  {sellerInfo?.rating || '4.8'} rating
                </span>
                <span>{sellerInfo?.totalSales || '42'} sales</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Member since {sellerInfo && new Date(sellerInfo.joinedDate).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
            })}
          </p>
          <Button variant="outline" className="w-full">Contact Seller</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuctionDetails;
