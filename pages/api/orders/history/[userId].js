import nc from 'next-connect';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/helpers';
import { isAuth } from '../../../../utils/auth';
import Order from '../../../../models/Order';

const handler = nc({ onError });
handler.use(isAuth);

handler.get(async (req, res) => {
  try {
    await db.connect();
    const orders = await Order.find({ user: req.query.userId });
    await db.disconnect();
    res.status(200).send(orders);
  } catch (err) {
    await db.disconnect();
    res.status(404).send({ message: 'Orders Not Found' });
  }
});

export default handler;
