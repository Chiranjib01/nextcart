import nc from 'next-connect';
import { v2 as cloudinary } from 'cloudinary';
import { onError } from '../../../../utils/helpers';
import { isAdmin, isAuth } from '../../../../utils/auth';
import multer from 'multer';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nc({ onError });
const upload = multer();

handler.use(isAuth, isAdmin, upload.single('file')).post(async (req, res) => {
  const uploadStream = (req) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'nextcart' },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };
  const result = await uploadStream(req);
  res.send(result);
});
export { cloudinary };

export default handler;
