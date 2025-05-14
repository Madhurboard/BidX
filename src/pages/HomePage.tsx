
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AuctionCard from '@/components/AuctionCard';
import { mockAuctions } from '@/data/mockAuctions';

const HomePage = () => {
  // Filter auctions for different sections
  const featuredAuctions = mockAuctions.filter(auction => auction.status === 'active').slice(0, 3);
  const endingSoonAuctions = mockAuctions.filter(auction => auction.status === 'ending-soon');
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-auction-blue to-auction-darkBlue text-white py-16 md:py-24">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover and Bid on Unique Items
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Join thousands of collectors and enthusiasts in India's premier online auction platform
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/auctions">
                <Button size="lg" className="bg-white text-auction-blue hover:bg-gray-100">
                  Explore Auctions
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" className="border-white text-white hover:bg-white/10">
                  Start Selling
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path fill="white" d="M47.3,-61.9C59.6,-52.7,67.2,-37,71.2,-20.7C75.2,-4.4,75.5,12.5,70.1,27.5C64.7,42.5,53.6,55.7,39.5,65.4C25.3,75.1,8.2,81.4,-9.7,82C-27.5,82.6,-55,77.5,-69.7,62.2C-84.3,46.9,-86.1,21.5,-82.5,-1.8C-78.9,-25,-69.8,-49.9,-54.4,-59.2C-39,-68.4,-17.3,-62.1,0.4,-62.6C18.1,-63.1,35,-71.1,47.3,-61.9Z" transform="translate(100 100)" />
          </svg>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How BidX Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-auction-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-auction-blue">
                  <path d="M7 10v12"></path>
                  <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Browse & Bid</h3>
              <p className="text-muted-foreground">Explore thousands of unique items and place competitive bids on your favorites.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-auction-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-auction-blue">
                  <path d="M12.136.183 22.612 8.3l-8.636 4.59L3.5 4.5Z"></path>
                  <path d="M23.12 12.8 12.414 23l-9-8.5V5.5L22.8 16l.32-3.2Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Win & Pay</h3>
              <p className="text-muted-foreground">Secure your wins with our easy UPI payment system and track your purchases.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-auction-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-auction-blue">
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                  <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path>
                  <path d="M12 3v6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">List & Sell</h3>
              <p className="text-muted-foreground">Create your own listings and sell items to our community of eager bidders.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Auctions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Auctions</h2>
            <Link to="/auctions" className="text-auction-blue hover:underline font-medium">View All</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Ending Soon */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Ending Soon</h2>
            <Link to="/auctions?filter=ending-soon" className="text-auction-blue hover:underline font-medium">View All</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {endingSoonAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-auction-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start bidding or selling?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users and become part of India's fastest-growing auction community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-auction-blue hover:bg-gray-100">
                Create Account
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button size="lg" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
