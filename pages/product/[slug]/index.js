import Layout from '../../../components/Layout';
import styles from './style.module.scss';
import db from '../../../utils/db';
import Product from '../../../models/Product';
import docToPlain from '../../../utils/docToPlain';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import actions from '../../../redux/actions';
import Rating from '../../../components/Rating';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';
import Reviews from '../../../components/Reviews';

export default function SingleProduct({ product }) {
  const dispatch = useDispatch();
  const addToCartHandler = (item) => {
    dispatch(actions.addToCart({ ...item, quantity: 1 }));
  };
  if (!product) {
    return <Loading />;
  }
  return (
    <Layout title={product.name} description={product.description}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <Image
            src={product.image}
            layout="responsive"
            height={1000}
            width={1000}
          />
        </div>
        <div className={styles.details}>
          <h1>{product.name}</h1>
          <div className={styles.line} />
          <h2>Category : {product.category}</h2>
          <h2>Brand : {product.brand}</h2>

          <h2 style={{ display: 'flex', flexWrap: 'wrap' }}>
            Rating :&nbsp;
            <Rating rating={product.rating} />({product.rating}) (
            {product.numReviews} Reviews)
          </h2>
          <h2>Description : {product.description}</h2>
          <div className={styles.line} />
          <div className={styles.card}>
            <h2>Price : {`$${product.price}`}</h2>
            <Button onClick={() => addToCartHandler(product)}>
              add to cart
            </Button>
          </div>
        </div>
      </div>
      <div>
        <Reviews productId={product._id} />
      </div>
    </Layout>
  );
}

export const getServerSideProps = async ({ params: { slug } }) => {
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: docToPlain(product),
    },
  };
};
