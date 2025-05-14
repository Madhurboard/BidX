
import React from 'react';
import HomePage from './HomePage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  // Inject style fix for the "Start Selling" button
  React.useEffect(() => {
    const startSellingBtn = document.querySelector('.homepage-cta-button');
    if (startSellingBtn) {
      startSellingBtn.classList.remove('bg-white', 'text-auction-blue');
      startSellingBtn.classList.add('bg-auction-blue', 'text-white', 'hover:bg-auction-darkBlue');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
