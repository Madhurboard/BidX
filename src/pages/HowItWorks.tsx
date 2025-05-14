
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  return (
    <div className="container py-12 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">How BidX Works</h1>
        <p className="text-lg text-muted-foreground">Your guide to buying and selling on India's premier auction platform</p>
      </div>

      {/* Process steps */}
      <div className="grid gap-12 mb-16">
        {/* For Buyers */}
        <div>
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">For Buyers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <div className="bg-auction-blue/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-auction-blue">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Auctions</h3>
              <p className="text-muted-foreground mb-4">Explore our extensive collection of auctions across various categories. Filter by category, ending time, or price range to find exactly what you're looking for.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <div className="bg-auction-blue/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-auction-blue">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Place Bids</h3>
              <p className="text-muted-foreground mb-4">Register or sign in to place bids on items you like. Set a maximum bid and our system will automatically bid for you up to your limit.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <div className="bg-auction-blue/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-auction-blue">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Win & Pay</h3>
              <p className="text-muted-foreground mb-4">If you're the highest bidder when the auction ends, you'll receive a notification. Complete your purchase securely using our UPI payment system.</p>
            </div>
          </div>
        </div>
        
        {/* For Sellers */}
        <div>
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">For Sellers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <div className="bg-auction-blue/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-auction-blue">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Listings</h3>
              <p className="text-muted-foreground mb-4">Sign up and list your items in minutes. Add high-quality photos, detailed descriptions, and set your starting price and auction duration.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <div className="bg-auction-blue/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-auction-blue">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Monitor Bids</h3>
              <p className="text-muted-foreground mb-4">Track the progress of your auctions in real-time. Respond to questions from potential buyers to increase your chances of a successful sale.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <div className="bg-auction-blue/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-auction-blue">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Receive Payment</h3>
              <p className="text-muted-foreground mb-4">Once your auction ends successfully, the buyer completes payment. Funds are transferred to your account after the buyer confirms receipt.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQs */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">How do I know my payment is secure?</h3>
            <p>BidX uses secure UPI payment processing with escrow protection. This means funds are held by BidX until both parties confirm the transaction is complete.</p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">What happens if I win an auction but change my mind?</h3>
            <p>Winning bids are binding agreements to purchase. Failure to complete payment may result in account restrictions. If you have concerns about an auction you've won, please contact support immediately.</p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">How are disputes handled?</h3>
            <p>Our dedicated support team reviews all reported issues. Both buyer and seller can submit evidence, and resolution is typically provided within 48 hours.</p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">What fees does BidX charge?</h3>
            <p>Listing items is free. Sellers pay a commission of 5% on successful sales. There are no fees for buyers beyond the winning bid amount.</p>
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="bg-auction-blue hover:bg-auction-darkBlue">
              Create Account
            </Button>
          </Link>
          <Link to="/auctions">
            <Button size="lg" variant="outline">
              Browse Auctions
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
