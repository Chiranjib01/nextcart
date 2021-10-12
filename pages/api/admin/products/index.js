import nc from 'next-connect';
import db from '../../../../utils/db';
import Product from '../../../../models/Product';
import { onError } from '../../../../utils/helpers';
import { isAuth, isAdmin } from '../../../../utils/auth';
import slugify from 'slugify';

const handler = nc({ onError });
handler.use(isAuth);
handler.use(isAdmin);

handler.post(async (req, res) => {
  try {
    const {
      name,
      category,
      image,
      isFeatured,
      featuredImage,
      price,
      brand,
      countInStock,
      description,
    } = req.body;
    const slug = slugify(name, {
      lower: true,
      trim: true,
    });
    await db.connect();
    const newProduct = featuredImage
      ? new Product({
          name,
          slug,
          category,
          image,
          isFeatured,
          featuredImage,
          price,
          brand,
          countInStock,
          description,
        })
      : new Product({
          name,
          slug,
          category,
          image,
          isFeatured,
          price,
          brand,
          countInStock,
          description,
        });
    const product = await newProduct.save();
    db.disconnect();
    res.send({ message: 'Created Successfully', product });
  } catch (err) {
    await db.disconnect();
    res.status(500).send({ message: 'Something went wrong' });
  }
});

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.status(200).send(products);
});

export default handler;
