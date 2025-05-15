
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusType } from '@/hooks/useAuctionsList';

interface FilterBarProps {
  onStatusChange: (value: string) => void;
  showDemo: boolean;
  onDemoToggle: (checked: boolean) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  onStatusChange, 
  showDemo, 
  onDemoToggle 
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => {
        // Convert the value to a type-safe StatusType
        const statusValue = value === "all" 
          ? null 
          : (value as StatusType);
        onStatusChange(value);
      }}>
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="ending-soon">Ending Soon</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex items-center">
        <label className="text-sm mr-2">
          <input
            type="checkbox"
            checked={showDemo}
            onChange={(e) => onDemoToggle(e.target.checked)}
            className="mr-1"
          />
          Show Demo Auctions
        </label>
      </div>
    </div>
  );
};

export default FilterBar;
