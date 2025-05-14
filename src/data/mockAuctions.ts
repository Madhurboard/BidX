
import { AuctionItem } from "@/components/AuctionCard";
import { Bid } from "@/components/BidHistory";

// Helper to generate a random date in the future (1-7 days)
const getRandomFutureDate = () => {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * 7) + 1;
  const randomHours = Math.floor(Math.random() * 24);
  const randomMinutes = Math.floor(Math.random() * 60);
  
  return new Date(now.getTime() + (randomDays * 24 * 60 * 60 * 1000) + 
                  (randomHours * 60 * 60 * 1000) + (randomMinutes * 60 * 1000));
};

// Helper to generate a random date in the past (1-30 days)
const getRandomPastDate = () => {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * 30) + 1;
  const randomHours = Math.floor(Math.random() * 24);
  const randomMinutes = Math.floor(Math.random() * 60);
  
  return new Date(now.getTime() - (randomDays * 24 * 60 * 60 * 1000) - 
                  (randomHours * 60 * 60 * 1000) - (randomMinutes * 60 * 1000));
};

// Generate a timeLeft string
const getTimeLeft = (endDate: Date) => {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  
  if (diff <= 0) return "Ended";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

// Generate status based on end time
const getStatus = (endDate: Date) => {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  
  if (diff <= 0) return "ended";
  if (diff <= 24 * 60 * 60 * 1000) return "ending-soon"; // 24 hours or less
  return "active";
};

// Mock auction items
export const mockAuctions: AuctionItem[] = [
  {
    id: "a1",
    title: "Vintage 1970s Fender Stratocaster",
    description: "A well-maintained vintage electric guitar with original components and a beautiful sunburst finish.",
    currentBid: 145000,
    bids: 12,
    timeLeft: "2d 5h",
    image: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    status: "active"
  },
  {
    id: "a2",
    title: "Limited Edition Mechanical Watch",
    description: "Swiss-made automatic movement with sapphire crystal and exhibition caseback. Only 500 pieces made worldwide.",
    currentBid: 35750,
    bids: 8,
    timeLeft: "4h 32m",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    status: "ending-soon"
  },
  {
    id: "a3",
    title: "Ancient Bronze Buddha Statue",
    description: "17th century bronze statue from Northern Thailand, exquisite craftsmanship with detailed patina.",
    currentBid: 78900,
    bids: 5,
    timeLeft: "5d 12h",
    image: "https://images.unsplash.com/photo-1642980520563-eaab5ef63ef5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    status: "active"
  },
  {
    id: "a4",
    title: "Signed First Edition Novel",
    description: "First edition, first printing of this award-winning novel, signed by the author with a personal dedication.",
    currentBid: 12800,
    bids: 4,
    timeLeft: "Ended",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    status: "ended"
  },
  {
    id: "a5",
    title: "Antique Handcrafted Wooden Chest",
    description: "Early 19th century teak chest with brass fittings and intricate carvings, perfect condition.",
    currentBid: 25400,
    bids: 7,
    timeLeft: "1d 8h",
    image: "https://images.unsplash.com/photo-1575023782549-62ca0d244b39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    status: "active"
  },
  {
    id: "a6",
    title: "Rare Indian Postage Stamp Collection",
    description: "Complete set of early Indian postage stamps from 1854-1947 including rare variations and misprints.",
    currentBid: 52300,
    bids: 15,
    timeLeft: "3h 45m",
    image: "https://images.unsplash.com/photo-1530989109-7aa8e4318cc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
    status: "ending-soon"
  },
  {
    id: "a7",
    title: "Certified Diamond Solitaire Ring",
    description: "1.5 carat brilliant-cut diamond set in 18k white gold, GIA certified VS1 clarity and F color.",
    currentBid: 118500,
    bids: 9,
    timeLeft: "6d 11h",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    status: "active"
  },
  {
    id: "a8",
    title: "Vintage Polaroid SX-70 Camera",
    description: "Fully functional iconic folding SLR instant camera from the 1970s with original leather case.",
    currentBid: 8900,
    bids: 11,
    timeLeft: "Ended",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    status: "ended"
  }
];

// Generate detailed auction with bids for a specific auction
export const getMockAuctionDetail = (id: string) => {
  const auction = mockAuctions.find(auction => auction.id === id);
  
  if (!auction) return null;
  
  // Generate random bids
  const numBids = auction.bids;
  const mockBids: Bid[] = [];
  
  const bidUsers = [
    { id: 'u1', name: 'Raj Sharma' },
    { id: 'u2', name: 'Priya Patel' },
    { id: 'u3', name: 'Vikram Singh' },
    { id: 'u4', name: 'Ananya Desai' },
    { id: 'u5', name: 'Arjun Mehta' },
  ];
  
  let currentAmount = auction.currentBid - (2000 * numBids);
  if (currentAmount < 1000) currentAmount = 1000;
  
  for (let i = 0; i < numBids; i++) {
    const randomUserIndex = Math.floor(Math.random() * bidUsers.length);
    const bidUser = bidUsers[randomUserIndex];
    const isLatest = i === numBids - 1;
    
    // Each bid increases by a random amount
    const increment = Math.floor(Math.random() * 2000) + 500;
    currentAmount += increment;
    
    // Generate a time in the past, ensuring chronological order
    const bidTime = new Date(
      new Date().getTime() - (numBids - i) * (Math.random() * 3600000 + 1800000)
    ).toISOString();
    
    mockBids.push({
      id: `bid-${id}-${i}`,
      userId: bidUser.id,
      userName: bidUser.name,
      amount: i === numBids - 1 ? auction.currentBid : currentAmount,
      time: bidTime,
      isLatest: isLatest
    });
  }
  
  // Sort bids by time (oldest first)
  mockBids.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  
  const randomEndDate = getRandomFutureDate();
  
  return {
    ...auction,
    description: auction.description + " " + auction.description, // Make description longer
    minBidIncrement: 500,
    seller: {
      id: 'seller1',
      name: 'Vintage Collectibles Ltd',
      rating: 4.8,
      joinedDate: '2020-05-12',
      totalSales: 127
    },
    endTime: auction.status === 'ended' ? getRandomPastDate() : randomEndDate,
    bids: mockBids
  };
};
