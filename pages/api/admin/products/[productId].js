import nc from 'next-connect';
import db from '../../../../utils/db';
import Product from '../../../../models/Product';
import { onError } from '../../../../utils/helpers';
import { isAuth, isAdmin } from '../../../../utils/auth';
import slugify from 'slugify';
import { cloudinary } from './upload';

const handler = nc({ onError });
handler.use(isAuth);
handler.use(isAdmin);

handler.put(async (req, res) => {
  try {
    await db.connect();
    const product = await Product.findById(req.query.productId);
    if (product._id) {
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
      product.name = name;
      product.slug = slugify(name, {
        lower: true,
        trim: true,
      });
      product.category = category;
      product.image = image;
      product.isFeatured = isFeatured;
      product.price = price;
      product.brand = brand;
      product.countInStock = countInStock;
      product.description = description;
      if (featuredImage) {
        product.featuredImage = featuredImage;
      }
      const newProduct = await product.save();
      await db.disconnect();
      res.send({ message: 'Updated successfully', product: newProduct });
    } else {
      await db.disconnect();
      res.status(404).send({ message: 'product not found' });
    }
  } catch (err) {
    await db.disconnect();
    res.status(500).send({ message: 'Something went wrong' });
  }
});
handler.delete(async (req, res) => {
  try {
    await db.connect();
    const product = await Product.findById(req.query.productId);
    if (product._id) {
      await Product.findByIdAndDelete(req.query.productId);
      await db.disconnect();
      const url =product.image;
      if (url.includes('res.cloudinary.com')) {
        const parts = url.split('/');
        const name = parts[parts.length - 1];
        const public_id = name.split('.')[0];
        try {
          cloudinary.uploader.destroy({ folder: 'nextcart' }, public_id);
        } catch (err) {
          return res
            .status(500)
            .send({ message: 'error occured in image deletion', error: err });
        }
      }
      res.send({ message: 'Deleted successfully' });
    } else {
      await db.disconnect();
      res.status(404).send({ message: 'product not found' });
    }
  } catch (err) {
    await db.disconnect();
    res.status(500).send({ message: 'Something went wrong' });
  }
});

export default handler;
