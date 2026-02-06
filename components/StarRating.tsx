
import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  isInteractive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, isInteractive = false, onRatingChange, className }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (index: number) => {
    if (isInteractive && onRatingChange) {
      onRatingChange(index);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (isInteractive) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (isInteractive) {
      setHoverRating(0);
    }
  };

  return (
    <div className={`flex items-center ${isInteractive ? 'cursor-pointer' : ''} ${className}`}>
      {[1, 2, 3, 4, 5].map((index) => {
        const fillValue = hoverRating > 0 ? hoverRating : rating;
        return (
          <svg
            key={index}
            className={`w-5 h-5 transition-colors duration-100 ${
              fillValue >= index ? 'text-amber-400' : 'text-gray-300'
            } ${isInteractive ? 'hover:text-amber-300' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
    </div>
  );
};

export default StarRating;
