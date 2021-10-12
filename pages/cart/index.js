import { useSelector, useDispatch } from 'react-redux';
import Layout from '../../components/Layout';
import styles from './style.module.scss';
import axios from 'axios';
import NextLink from 'next/link';
import Image from 'next/image';
import actions from '../../redux/actions';
import { useRouter } from 'next/router';

const CartScreen = () => {
  const router = useRouter();
  const { cartItems } = useSelector((state) => state.cartReducer);
  const { user } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (quantity > data.countInStock) {
      dispatch(actions.showAlert('Out Of Stock'));
      return;
    }
    dispatch(actions.addToCart({ ...item, quantity }));
  };
  const removeFromCartHandler = (item) => {
    dispatch(actions.removeFromCart(item));
  };
  const clickHandler = () => {
    if (!user) {
      router.push('/login?redirect=/shipping');
    } else {
      router.push('/shipping');
    }
  };
  return (
    <Layout title="Cart">
      <h1 className={styles.title}>Shopping Cart</h1>
      <div className={styles.container}>
        {cartItems.length > 0 ? (
          <>
            <div className={styles.table}>
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th className={styles.textRight}>Quantity</th>
                    <th className={styles.textRight}>Price</th>
                    <th className={styles.textCenter}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <NextLink href={`/product/${item.slug}`}>
                          <a>
                            <Image src={item.image} height={50} width={50} />
                          </a>
                        </NextLink>
                      </td>
                      <td>
                        <NextLink href={`/product/${item.slug}`}>
                          {item.name}
                        </NextLink>
                      </td>
                      <td className={styles.textRight}>
                        <select
                          value={item.quantity}
                          onChange={(e) =>
                            updateCartHandler(item, e.target.value)
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option value={x + 1} key={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className={styles.textRight}>${item.price}</td>
                      <td className={styles.textCenter}>
                        <button onClick={() => removeFromCartHandler(item)}>
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.checkout}>
              <h2>
                SubTotal : $
                {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)} (
                {cartItems.reduce((a, c) => a + Number(c.quantity), 0)}
                {cartItems.reduce((a, c) => a + Number(c.quantity), 0) > 1
                  ? ' items'
                  : ' item'}
                )
              </h2>
              <button onClick={clickHandler}>Checkout</button>
            </div>
          </>
        ) : (
          <p>
            Cart is empty !!{' '}
            <NextLink href="/">
              <a>Go Shopping</a>
            </NextLink>
          </p>
        )}
      </div>
    </Layout>
  );
};

export default CartScreen;
