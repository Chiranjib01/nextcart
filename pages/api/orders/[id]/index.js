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
    const order = await Order.findById(req.query.id);
    await db.disconnect();
    res.status(200).send(order);
  } catch (err) {
    await db.disconnect();
    res.status(404).send({ message: 'Order Not Found' });
  }
});

export default handler;
