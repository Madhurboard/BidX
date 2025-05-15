
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onSubmit,
  sortOption,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <form onSubmit={onSubmit} className="relative w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search auctions..."
            className="pl-9"
            value={searchTerm}
            onChange={onSearchChange}
          />
          <Button 
            type="submit" 
            className="absolute right-1 top-1 h-8"
            variant="ghost"
          >
            Search
          </Button>
        </form>
      </div>
      <Select value={sortOption} onValueChange={onSortChange}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ending-soon">Ending Soon</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="most-bids">Most Bids</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchBar;
