import nc from 'next-connect';
import db from '../../../utils/db';
import { onError } from '../../../utils/helpers';
import { isAuth } from '../../../utils/auth';
import Order from '../../../models/Order';

const handler = nc({ onError });
handler.use(isAuth);

handler.post(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;
  await db.connect();
  const newOrder = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });
  const order = await newOrder.save();
  await db.disconnect();
  res.status(200).send(order);
});

export default handler;
