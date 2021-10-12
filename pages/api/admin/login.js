import nc from 'next-connect';
import { signToken } from '../../../utils/auth';

const handler = nc();

handler.post(async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const admin = {
        _id: 'chiranjibnath10203040506',
        name: 'imChiranjib',
        email,
      };
      const token = signToken(admin);
      return res.status(200).send({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token,
      });
    } else {
      return res.status(401).send({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).send({ message: err.toString() });
  }
});

export default handler;
