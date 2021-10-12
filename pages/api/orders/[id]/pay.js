import nc from 'next-connect';
import db from '../../../../utils/db';
import Order from '../../../../models/Order';
import { onError } from '../../../../utils/helpers';
import { isAuth } from '../../../../utils/auth';

const handler = nc({ onError });

handler.use(isAuth);

handler.put(async (req, res) => {
  db.connect();
  const order = await Order.findById(req.query.id);
  console.log(req.body);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.email_address,
    };
    const paidOrder = await order.save();
    db.disconnect();
    res.send({ message: 'Order paid', order: paidOrder });
  } else {
    db.disconnect();
    res.status(404).send({ message: 'Order not found' });
  }
});

export default handler;
