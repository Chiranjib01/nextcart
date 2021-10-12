import nextConnect from 'next-connect';
import Review from '../../../../models/Review';
import Product from '../../../../models/Product';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/helpers';
import { getError } from '../../../../utils/helpers';

const handler = nextConnect({ onError });
handler.use(isAuth);

// edit review PUT /api/reviews/u/:reviewId
handler.put(async (req, res) => {
  try {
    await db.connect();
    const review = await Review.findById(req.query.reviewId);
    if (review && review._id) {
      review.rating = req.body.rating;
      review.text = req.body.text;
      const newReview = await review.save();
      const reviews = await Review.find({ productId: review.productId });
      const getRating = () => {
        const total = [...reviews].reduce((a, c) => a + c.rating, 0);
        const rating = reviews.length > 0 ? total / reviews.length : 0;
        return Math.round(rating * 100 + Number.EPSILON) / 100;
      };
      const product = await Product.findById(review.productId);
      if (!product && !product._id) {
        await db.disconnect();
        return res.status(404).send({ message: 'product not found' });
      }
      product.rating = reviews.length > 0 ? getRating() : 0;
      await product.save();
      await db.disconnect();
      res.send({ message: 'review updated successfully', review: newReview });
    } else {
      await db.disconnect();
      res.status(404).send({ message: 'review not found' });
    }
  } catch (err) {
    await db.disconnect();
    res.status(500).send({ message: getError(err) });
  }
});
// delete review DELETE /api/reviews/u/:reviewId
handler.delete(async (req, res) => {
  try {
    await db.connect();
    const review = await Review.findById(req.query.reviewId);
    if (review && review._id) {
      const product = await Product.findById(review.productId);
      await Review.findByIdAndDelete(review._id);
      if (!product && !product._id) {
        await db.disconnect();
        return res.status(404).send({ message: 'product not found' });
      }
      const reviews = await Review.find({ productId: review.productId });
      const getRating = () => {
        const total = [...reviews].reduce((a, c) => a + c.rating, 0);
        const rating = reviews.length > 0 ? total / reviews.length : 0;
        return Math.round(rating * 100 + Number.EPSILON) / 100;
      };
      product.rating = reviews.length > 0 ? getRating() : 0;
      product.numReviews = reviews.length;
      await product.save();
      await db.disconnect();
      res.send({ message: 'review deleted successfully' });
    } else {
      await db.disconnect();
      res.status(404).send({ message: 'review not found' });
    }
  } catch (err) {
    await db.disconnect();
    res.status(500).send({ message: getError(err) });
  }
});

export default handler;
