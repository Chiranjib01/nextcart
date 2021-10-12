import nextConnect from 'next-connect';
import Review from '../../../models/Review';
import db from '../../../utils/db';
import { onError } from '../../../utils/helpers';

const handler = nextConnect({ onError });

// get review by productId GET /api/reviews/:productId
handler.get(async (req, res) => {
  try {
    await db.connect();
    const review = await Review.find({ productId: req.query.productId }).sort([
      ['createdAt', -1],
    ]);
    await db.disconnect();
    if (review) {
      res.send(review);
    } else {
      res.status(404).send({ message: 'no review found' });
    }
  } catch (err) {
    await db.disconnect();
    res.status(500).send({ message: 'Something went wrong' });
  }
});

export default handler;
