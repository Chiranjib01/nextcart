import nc from 'next-connect';
import db from '../../../utils/db';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';

const handler = nc();

handler.post(async (req, res) => {
  try {
    jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        return res.status(400).send({ message: 'Invalid Token' });
      } else {
        await db.connect();
        const userExist = await User.findOne({ email: decode.email });
        if (userExist && userExist._id) {
          await db.disconnect();
          return res.status(400).send({ message: 'user already exist' });
        }
        const newUser = new User({
          name: decode.name,
          email: decode.email,
          password: decode.password,
        });
        const user = await newUser.save();
        await db.disconnect();
        return res
          .status(200)
          .send({ message: 'account activated successfully', user });
      }
    });
  } catch (err) {
    db.disconnect();
    res.status(500).send({ message: 'Something went wrong', error: err });
  }
});

export default handler;
