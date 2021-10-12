import Star from '../Star';

const Rating = ({ rating }) => {
  const stars = Math.round(rating);
  return (
    <div style={{ display: 'inline-block' }}>
      <Star color={stars >= 1 && '#f0c000'} />
      <Star color={stars >= 2 && '#f0c000'} />
      <Star color={stars >= 3 && '#f0c000'} />
      <Star color={stars >= 4 && '#f0c000'} />
      <Star color={stars >= 5 && '#f0c000'} />
    </div>
  );
};

export default Rating;
