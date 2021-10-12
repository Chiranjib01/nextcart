import nextConnect from 'next-connect';
import Review from '../../../models/Review';
import User from '../../../models/User';
import Product from '../../../models/Product';
import { isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
import { onError } from '../../../utils/helpers';
import { getError } from '../../../utils/helpers';

const handler = nextConnect({ onError });

// create review POST /api/reviews
handler.use(isAuth).post(async (req, res) => {
  try {
    await db.connect();
    const existReview = await Review.find({
      userId: req.user._id,
      productId: req.body.productId,
    });
    if (existReview && existReview._id) {
      await db.disconnect();
      return res
        .status(400)
        .send({ message: "can't have more than one review" });
    }
    const { name } = await User.findById(req.user._id);
    const newReview = new Review({
      userId: req.user._id,
      userName: name,
      productId: req.body.productId,
      rating: req.body.rating,
      text: req.body.text,
    });
    const review = await newReview.save();
    const product = await Product.findById(req.body.productId);
    const reviews = await Review.find({ productId: req.body.productId });
    if (!product && !product._id) {
      await db.disconnect();
      return res.status(404).send({ message: 'product not found' });
    }
    const getRating = () => {
      const total = [...reviews].reduce((a, c) => a + c.rating, 0);
      const rating = reviews.length > 0 ? total / reviews.length : 0;
      return Math.round(rating * 100 + Number.EPSILON) / 100;
    };
    product.rating = reviews.length > 0 ? getRating() : 0;
    product.numReviews = reviews.length;
    await product.save();
    await db.disconnect();
    res.send({ message: 'review added successfully', review });
  } catch (err) {
    await db.disconnect();
    res.status(500).send({ message: getError(err) });
  }
});

export default handler;
