import nc from 'next-connect';
import db from '../../../../utils/db';
import User from '../../../../models/User';
import { onError } from '../../../../utils/helpers';
import { isAuth, isAdmin } from '../../../../utils/auth';

const handler = nc({ onError });
handler.use(isAuth);
handler.use(isAdmin);

handler.put(async (req, res) => {
  try {
    await db.connect();
    const user = await User.findById(req.query.userId);
    if (user._id) {
      user.name = req.body.name;
      const newUser = await user.save();
      await db.disconnect();
      res.send({ message: 'updated successfully',user:newUser });
    } else {
      await db.disconnect();
      res.status(401).send({ message: 'Something went wrong' });
    }
  } catch (err) {
    await db.disconnect();
    res.status(500).send({ message: 'Something went wrong' });
  }
});

handler.delete(async (req, res) => {
  try {
    await db.connect();
    const user = await User.findById(req.query.userId);
    if (user._id) {
      await User.findByIdAndDelete(req.query.userId);
      await db.disconnect();
      res.send({ message: 'Deleted successfully' });
    } else {
      await db.disconnect();
      res.status(401).send({ message: 'Something went wrong' });
    }
  } catch (err) {
    await db.disconnect();
    res.status(500).send({ message: 'Something went wrong' });
  }
});

export default handler;
