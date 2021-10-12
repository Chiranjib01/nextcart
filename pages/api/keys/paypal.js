import nc from 'next-connect';
import { onError } from '../../../utils/helpers';
import { isAuth } from '../../../utils/auth';

const handler = nc({ onError });

handler.use(isAuth);

handler.get(async (req, res) => {
  res.status(200).send(process.env.PAYPAL_CLIENT_ID);
});

export default handler;
