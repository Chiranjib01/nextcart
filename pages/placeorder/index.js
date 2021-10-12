import { useSelector, useDispatch } from 'react-redux';
import Layout from '../../components/Layout';
import styles from './style.module.scss';
import axios from 'axios';
import NextLink from 'next/link';
import Image from 'next/image';
import actions from '../../redux/actions';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getError } from '../../utils/helpers';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';
import StepWizard from '../../components/StepWizard';
import Button from '../../components/Button';

const PlaceOrder = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { cartItems } = useSelector((state) => state.cartReducer);
  const { user, shippingAddress, paymentMethod } = useSelector(
    (state) => state.userReducer
  );
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    if (cartItems.length === 0) {
      router.push('/');
    }
    if (!shippingAddress.address) {
      router.push('/shipping');
    }
    if (!paymentMethod) {
      router.push('/payment');
    }
  }, []);
  const dispatch = useDispatch();
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.1);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  const clickHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `/api/orders`,
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      dispatch(actions.emptyCart());
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      dispatch(actions.showAlert(getError(err), 'error'));
    }
  };
  return (
    <Layout title={`Place Order`}>
      <div className={styles.wizardPadding}>
        <StepWizard activeStep={4} />
      </div>
      <h1 className={styles.title}>Place Order</h1>
      <div className={styles.container}>
        <Modal />
        <div className={styles.details}>
          <div className={styles.card}>
            <h2>Shipping Address : </h2>
            <div className={styles.line}></div>
            <p>{`${shippingAddress.fullName} ; ${shippingAddress.address} ; ${shippingAddress.city} ; ${shippingAddress.postalCode} ; ${shippingAddress.country}`}</p>
          </div>
          <div className={styles.card}>
            <h2>Payment Method : </h2>
            <div className={styles.line}></div>
            <p>{paymentMethod}</p>
          </div>
          <div className={styles.table}>
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th className={styles.textRight}>Quantity</th>
                  <th className={styles.textRight}>Price</th>
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
                    <td className={styles.textRight}>{item.quantity}</td>
                    <td className={styles.textRight}>${item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.summary}>
          <h2>Order Summary</h2>
          <div className={styles.line}></div>
          <table>
            <tbody>
              <tr>
                <td>
                  <p>Items</p>
                </td>
                <td>
                  <strong>:</strong>
                </td>
                <td>
                  <p>${itemsPrice}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Shipping</p>
                </td>
                <td>
                  <strong>:</strong>
                </td>
                <td>
                  <p>${shippingPrice}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Tax</p>
                </td>
                <td>
                  <strong>:</strong>
                </td>
                <td>
                  <p>${taxPrice}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    <strong>Total</strong>
                  </p>
                </td>
                <td>
                  <strong>:</strong>
                </td>
                <td>
                  <p>
                    <strong>${totalPrice}</strong>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <div className={styles.line}></div>
          <Button type="button" onClick={clickHandler}>
            Place Order
          </Button>
          {loading && <Loading />}
        </div>
      </div>
    </Layout>
  );
};

export default PlaceOrder;
