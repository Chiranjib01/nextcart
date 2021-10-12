import nc from 'next-connect';
import db from '../../../utils/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { isAuth } from '../../../utils/auth';
import { onError } from '../../../utils/helpers';

const handler = nc({ onError });
handler.use(isAuth);

handler.put(async (req, res) => {
  try {
    await db.connect();
    const user = await User.findById(req.query.id);
    if (user) {
      if (!req.body.password) {
        user.name = req.body.name;
        user.email = req.body.email;
        const newUser = await user.save();
        await db.disconnect();
        return res.status(200).send({
          ...newUser,
        });
      }
      if (req.body.password && req.body.password.length >= 6) {
        if (req.body.password.length <= 16) {
          user.password = bcrypt.hashSync(req.body.password);
          user.name = req.body.name;
          user.email = req.body.email;
          const newUser = await user.save();
          await db.disconnect();
          return res.status(200).send({
            ...newUser,
          });
        } else {
          await db.disconnect();
          return res
            .status(400)
            .send({ message: 'password length must be less than 17' });
        }
      } else {
        await db.disconnect();
        return res
          .status(400)
          .send({ message: 'password length must be atleast 6' });
      }
    } else {
      await db.disconnect();
      return res.status(400).send({ message: 'user not found' });
    }
  } catch (err) {
    await db.disconnect();
    res.send(500).send({ message: 'Something went wrong' });
  }
});

export default handler;
