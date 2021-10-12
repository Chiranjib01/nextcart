import Image from 'next/image';
import NextLink from 'next/link';
import styles from './style.module.scss';
import { useDispatch } from 'react-redux';
import actions from '../../redux/actions';
import Rating from '../Rating';

const Products = ({ title, products }) => {
  const dispatch = useDispatch();
  const addToCartHandler = (item) => {
    dispatch(actions.addToCart({ ...item, quantity: 1 }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <section className={styles.main}>
        {products.length > 0 ? (
          products.map((product) => (
            <div className={styles.card} key={product._id}>
              <NextLink href={`/product/${product.slug}`}>
                <div className={styles.cardActionArea}>
                  <Image
                    src={product.image}
                    width={1000}
                    height={1000}
                    alt={product.name}
                  />
                  <h1>{product.name}</h1>
                  <div className={styles.rating}>
                    <Rating rating={product.rating} />
                    {/* Rating : {product.rating} Stars */}
                  </div>
                </div>
              </NextLink>
              <div className={styles.cardActions}>
                <button
                  className={styles.addToCartButton}
                  onClick={() => addToCartHandler(product)}
                >
                  add to cart
                </button>
                <p>{`$${product.price}`}</p>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noProduct}>No Product Found !!!</div>
        )}
      </section>
    </div>
  );
};

export default Products;
