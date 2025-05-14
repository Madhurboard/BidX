
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface UPIPaymentProps {
  amount: number;
  itemName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const UPIPayment: React.FC<UPIPaymentProps> = ({
  amount,
  itemName,
  onSuccess,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("qr");
  const [verifying, setVerifying] = useState(false);
  
  // Mock UPI ID for the platform
  const platformUPI = "bidhub@ybl";
  
  // Mock UPI QR Code data URL
  const qrCodeUrl = "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg";
  
  const handlePaymentVerification = () => {
    setVerifying(true);
    
    // Simulate payment verification process
    setTimeout(() => {
      // Simulate successful payment
      toast({
        title: "Payment Successful!",
        description: `Your payment of ₹${amount.toLocaleString()} for ${itemName} has been received.`,
      });
      
      setVerifying(false);
      onSuccess();
    }, 3000);
  };
  
  const handlePayNow = () => {
    setLoading(true);
    
    // Simulate app deep linking and return
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Return from UPI app",
        description: "Please verify your payment by clicking the button below",
      });
    }, 2000);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Complete Your Payment</CardTitle>
        <CardDescription>Pay ₹{amount.toLocaleString()} for {itemName}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="qr" onValueChange={setPaymentMethod}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="qr">QR Code</TabsTrigger>
            <TabsTrigger value="upi">UPI ID</TabsTrigger>
          </TabsList>
          
          <TabsContent value="qr" className="mt-4">
            <div className="flex flex-col items-center">
              <div className="border p-4 rounded-md bg-white mb-4">
                <img 
                  src={qrCodeUrl} 
                  alt="UPI QR Code" 
                  className="w-48 h-48"
                />
              </div>
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Scan this QR code using any UPI app like Google Pay, PhonePe, BHIM, or Paytm
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="upi" className="mt-4">
            <div className="text-center mb-6">
              <p className="font-medium mb-2">Pay to UPI ID:</p>
              <div className="bg-gray-50 p-3 rounded-md border mb-4">
                <p className="font-mono">{platformUPI}</p>
              </div>
              
              <Button 
                onClick={handlePayNow} 
                className="w-full bg-auction-green hover:bg-auction-green/90 mb-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="mr-2">Opening UPI App...</span>
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  </>
                ) : (
                  "Pay Now"
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                This will open your default UPI app to complete the payment
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 border-t pt-6">
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={handlePaymentVerification}
              disabled={verifying}
              variant="outline"
              className="w-full"
            >
              {verifying ? (
                <>
                  <span className="mr-2">Verifying...</span>
                  <div className="h-4 w-4 rounded-full border-2 border-auction-blue border-t-transparent animate-spin"></div>
                </>
              ) : (
                "I've Completed the Payment"
              )}
            </Button>
            
            <Button 
              onClick={onCancel}
              variant="ghost"
              className="w-full text-muted-foreground"
              disabled={verifying}
            >
              Cancel
            </Button>
          </div>
          
          <div className="mt-6">
            <p className="text-xs text-muted-foreground">
              By proceeding with the payment, you agree to our payment terms & conditions.
              Funds will be held in escrow until the auction completion.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UPIPayment;
