
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endTime: string | Date;
  onEnd?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endTime, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endTime).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft('Auction ended');
        if (onEnd) onEnd();
        return;
      }
      
      // Set isEnding flag if less than 10 minutes left
      if (difference <= 600000 && !isEnding) { // 10 minutes in milliseconds
        setIsEnding(true);
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
      } else {
        return `${minutes}m ${seconds}s`;
      }
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [endTime, onEnd, isEnding]);
  
  return (
    <span className={`countdown-timer ${isEnding ? 'text-auction-red animate-pulse-subtle' : ''}`}>
      {timeLeft}
    </span>
  );
};

export default CountdownTimer;
