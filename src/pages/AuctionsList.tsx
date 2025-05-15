
import React from 'react';
import { useAuctionsList } from '@/hooks/useAuctionsList';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '@/components/auctions-list/SearchBar';
import FilterBar from '@/components/auctions-list/FilterBar';
import AuctionGrid from '@/components/auctions-list/AuctionGrid';
import LoadingState from '@/components/auctions-list/LoadingState';

const AuctionsList = () => {
  const [, setSearchParams] = useSearchParams();
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortOption,
    setSortOption,
    showDemo,
    setShowDemo,
    isLoading,
    handleSearch,
    auctions
  } = useAuctionsList();
  
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter(null);
    setSearchParams({});
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Browse Auctions</h1>
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onSubmit={handleSearch}
            sortOption={sortOption}
            onSortChange={setSortOption}
          />
          
          <FilterBar
            onStatusChange={(value) => {
              // Convert the value to a type-safe StatusType
              const statusValue = value === "all" 
                ? null 
                : (value as any);
              setStatusFilter(statusValue);
            }}
            showDemo={showDemo}
            onDemoToggle={setShowDemo}
          />
        </div>
        
        <AuctionGrid 
          auctions={auctions} 
          onClearFilters={clearFilters} 
        />
      </div>
    </div>
  );
};

export default AuctionsList;
