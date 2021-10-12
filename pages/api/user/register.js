import nc from 'next-connect';
import db from '../../../utils/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { signVerificationToken } from '../../../utils/auth';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

//env variables
const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const REDIRECT_URI = process.env.REDIRECT_URI;
const DOMAIN_NAME = process.env.DOMAIN_NAME;

const handler = nc();

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendMail = async (emailTo, token, name) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'chiranjibnath102@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: 'NEXTCART <chiranjibnath102@gmail.com>',
      to: emailTo,
      subject: 'Nextcart Account Activation Link',
      html: `
        <h1 style="text-align:center;">Hi ${name} ! Welcome </h1>
        <h2 style="text-align:center;">Nextcart Account Activation</h2>
        <h4 style="text-align:center;">Click The Button To Activate Your Account</h4>
        <div style="margin-top:5px;margin-bottom:5px;margin-left:auto;margin-right:auto;display:flex;"><a  style="margin-top:5px;margin-bottom:5px;margin-left:auto;margin-right:auto;display:inline-block;padding-top:5px;padding-bottom:5px;padding-left:10px;padding-right:10px;font-size:16px;font-weight:600;border-radius:2px;border-radius:2px;border:none;color:green;text-decoration:none;" href='${DOMAIN_NAME}/register/activate?token=${token}'>Activate</a></div>
      `,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (err) {
    return err;
  }
};

handler.post(async (req, res) => {
  try {
    await db.connect();
    const user = await User.findOne({ email: req.body.email });
    await db.disconnect();
    if (user && user._id) {
      return res.status(400).send({ message: 'user already exists' });
    } else {
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
      };
      const token = signVerificationToken(newUser);
      try {
        sendMail(newUser.email, token, newUser.name)
          .then((result) => {
            console.log(result);
            return res.status(200).send({ message: 'verification email sent' });
          })
          .catch((err) => {
            return res.status(500).send({
              message: 'Error occured while sending mail',
              error: err,
            });
          });
      } catch (err) {
        return res
          .status(500)
          .send({ message: 'Error occured while sending mail', error: err });
      }
    }
  } catch (err) {
    db.disconnect();
    res.status(500).send({ message: 'Something went wrong' });
  }
});

export default handler;
