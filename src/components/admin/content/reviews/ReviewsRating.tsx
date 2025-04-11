import React from "react";
import { FaStar } from "react-icons/fa6";

interface ReviewsRatingProps {
  rate: number;
}

const ReviewsRating = ({ rate }: ReviewsRatingProps) => {
  return (
    <div className="flex gap-2 text-primary md:text-lg">
      {[...Array(rate)].map((_, index) => (
        <FaStar key={index} />
      ))}
    </div>
  );
};

export default ReviewsRating;
