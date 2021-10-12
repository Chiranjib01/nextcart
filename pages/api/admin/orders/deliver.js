import nc from 'next-connect';
import db from '../../../../utils/db';
import Order from '../../../../models/Order';
import { onError } from '../../../../utils/helpers';
import { isAuth, isAdmin } from '../../../../utils/auth';

const handler = nc({ onError });
handler.use(isAuth);
handler.use(isAdmin);

handler.put(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.body.orderID);
  if (order._id && order.isPaid) {
    order.deliveredAt = Date.now();
    order.isDelivered = true;
    const newOrder = await order.save();
    await db.disconnect();
    res.send(newOrder);
  } else {
    await db.disconnect();
    res.status(400).send({ message: 'Something went wrong' });
  }
});

export default handler;
