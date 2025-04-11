import React from "react";

interface CreateRatingProps {
  rate: number;
  setRate: (rate: number) => void;
}

const CreateRating = ({ rate, setRate }: CreateRatingProps) => {
  return (
    <div className="rating rating-lg md:rating-md flex gap-2">
      <input
        type="radio"
        name="rating-4"
        className="mask mask-star-2 bg-green-500"
        checked={rate === 1}
        onChange={() => setRate(1)}
      />
      <input
        type="radio"
        name="rating-4"
        className="mask mask-star-2 bg-green-500"
        checked={rate === 2}
        onChange={() => setRate(2)}
      />
      <input
        type="radio"
        name="rating-4"
        className="mask mask-star-2 bg-green-500"
        checked={rate === 3}
        onChange={() => setRate(3)}
      />
      <input
        type="radio"
        name="rating-4"
        className="mask mask-star-2 bg-green-500"
        checked={rate === 4}
        onChange={() => setRate(4)}
      />
      <input
        type="radio"
        name="rating-4"
        className="mask mask-star-2 bg-green-500"
        checked={rate === 5}
        onChange={() => setRate(5)}
      />
    </div>
  );
};

export default CreateRating;
