import nc from 'next-connect';
import db from '../../../../utils/db';
import Order from '../../../../models/Order';
import { onError } from '../../../../utils/helpers';
import { isAuth, isAdmin } from '../../../../utils/auth';

const handler = nc({ onError });
handler.use(isAuth);
handler.use(isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const orders = await Order.find({});
  await db.disconnect();
  res.status(200).send(orders);
});

export default handler;
