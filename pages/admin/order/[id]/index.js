import { useSelector, useDispatch } from 'react-redux';
import Layout from '../../../../components-admin/Layout';
import styles from './style.module.scss';
import axios from 'axios';
import NextLink from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useReducer, useState } from 'react';
import { getError } from '../../../../utils/helpers';
import actions from '../../../../redux/actions';
import Modal from '../../../../components/Modal';
import Loading from '../../../../components/Loading';
import Button from '../../../../components/Button';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '', order: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const Order = ({ orderId }) => {
  const alertDispatch = useDispatch();
  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    order: {},
  });
  const [isPending, setIsPending] = useState(false);
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid,
    isDelivered,
    paidAt,
    deliveredAt,
  } = order;
  const router = useRouter();
  const { adminInfo } = useSelector((state) => state.adminReducer);
  useEffect(() => {
    if (!adminInfo) {
      router.push('/');
    }

    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            authorization: `Bearer ${adminInfo.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [order]);

  const deliver = async (orderID) => {
    setIsPending(true);
    try {
      const { data } = await axios.put(
        `/api/admin/orders/deliver`,
        { orderID },
        {
          headers: {
            authorization: `Bearer ${adminInfo.token}`,
            admin: adminInfo.email,
          },
        }
      );
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
      setIsPending(false);
      alertDispatch(actions.showAlert('Order Delivered .', 'success'));
    } catch (err) {
      setIsPending(false);
      alertDispatch(actions.showAlert(getError(err), 'error'));
    }
  };

  return (
    <Layout title={`Order ${orderId}`}>
      <h1 className={styles.title}>{`Order ${orderId}`}</h1>
      <Modal />
      <div className={styles.container}>
        {loading ? (
          <Loading />
        ) : error ? (
          <div className={styles.errorBox}>{error}</div>
        ) : (
          <>
            <div className={styles.details}>
              <div className={styles.card}>
                <h2>Shipping Address : </h2>
                <div className={styles.line}></div>
                <p>{`${shippingAddress.fullName} ; ${shippingAddress.address} ; ${shippingAddress.city} ; ${shippingAddress.postalCode} ; ${shippingAddress.country}`}</p>
                <p>
                  Status:&nbsp;
                  {isDelivered
                    ? `Delivered At ${deliveredAt}`
                    : `Not Delivered`}
                </p>
              </div>
              <div className={styles.card}>
                <h2>Payment Method : </h2>
                <div className={styles.line}></div>
                <p>{paymentMethod}</p>
                <p>
                  Status:&nbsp;
                  {isPaid ? `Paid At ${paidAt}` : `Not Paid`}
                </p>
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
                    {orderItems.map((item) => (
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
              {isPaid &&
                !isDelivered &&
                (isPending ? (
                  <Loading />
                ) : (
                  <div className={styles.fullWidth}>
                    <Button onClick={() => deliver(order._id)}>Deliver</Button>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps = ({ params: { id } }) => {
  return {
    props: { orderId: id },
  };
};

export default Order;
