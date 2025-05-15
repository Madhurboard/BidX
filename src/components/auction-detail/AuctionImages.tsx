
import React from 'react';

interface AuctionImagesProps {
  image: string;
  title: string;
}

const AuctionImages: React.FC<AuctionImagesProps> = ({ image, title }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-[400px] object-cover"
      />
    </div>
  );
};

export default AuctionImages;
