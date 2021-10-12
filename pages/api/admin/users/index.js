import nc from 'next-connect';
import db from '../../../../utils/db';
import User from '../../../../models/User';
import { onError } from '../../../../utils/helpers';
import { isAuth, isAdmin } from '../../../../utils/auth';

const handler = nc({ onError });
handler.use(isAuth);
handler.use(isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const users = await User.find({});
  await db.disconnect();
  res.status(200).send(users);
});

export default handler;
