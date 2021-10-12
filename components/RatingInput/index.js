import { useState } from 'react';
import Star from '../Star';

const RatingInput = () => {
  const [rating, setRating] = useState(0);
  return (
    <div style={{ display: 'inline-block' }}>
      <label htmlFor="star1">
        <Star color={rating >= 1 ? '#f0c000' : '#a39f9f'} />
        <input
          style={{ display: 'none' }}
          id="star1"
          type="radio"
          name="rating"
          checked={rating === 1}
          value={1}
          onChange={(e) => setRating(Number(e.target.value))}
        />
      </label>
      <label htmlFor="star2">
        <Star color={rating >= 2 ? '#f0c000' : '#a39f9f'} />
        <input
          style={{ display: 'none' }}
          id="star2"
          type="radio"
          name="rating"
          checked={rating === 2}
          value={2}
          onChange={(e) => setRating(Number(e.target.value))}
        />
      </label>
      <label htmlFor="star3">
        <Star color={rating >= 3 ? '#f0c000' : '#a39f9f'} />
        <input
          style={{ display: 'none' }}
          id="star3"
          type="radio"
          name="rating"
          checked={rating === 3}
          value={3}
          onChange={(e) => setRating(Number(e.target.value))}
        />
      </label>
      <label htmlFor="star4">
        <Star color={rating >= 4 ? '#f0c000' : '#a39f9f'} />
        <input
          style={{ display: 'none' }}
          id="star4"
          type="radio"
          name="rating"
          checked={rating === 4}
          value={4}
          onChange={(e) => setRating(Number(e.target.value))}
        />
      </label>
      <label htmlFor="star5">
        <Star color={rating >= 5 ? '#f0c000' : '#a39f9f'} />
        <input
          style={{ display: 'none' }}
          id="star5"
          type="radio"
          name="rating"
          checked={rating === 5}
          value={5}
          onChange={(e) => setRating(Number(e.target.value))}
        />
      </label>
    </div>
  );
};

export default RatingInput;
