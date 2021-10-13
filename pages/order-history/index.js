import { useSelector } from 'react-redux';
import Layout from '../../components/Layout';
import styles from './style.module.scss';
import axios from 'axios';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { getError } from '../../utils/helpers';
import { useReducer, useEffect } from 'react';
import Loading from '../../components/Loading';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '', orders: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const OrderHistory = () => {
  const router = useRouter();
  const [{ loading, orders, error }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });
  const { user } = useSelector((state) => state.userReducer);
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/history/${user._id}`, {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchOrders();
  }, []);
  return (
    <Layout title="Order History">
      <div className={styles.container}>
        <div className={styles.control}>
          <ul className={styles.menu}>
            <li onClick={() => router.push('/profile')}>User Profile</li>
            <div className={styles.line}></div>
            <li className={styles.selected}>Order History</li>
          </ul>
        </div>
        <div className={styles.tableContainer}>
          <h2 className={styles.title}>Order History</h2>
          <div className={styles.line}></div>
          {loading ? (
            <Loading />
          ) : error ? (
            <div className={styles.errorBox}>{error}</div>
          ) : orders.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Delivered</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.slice(20)}</td>
                    <td>{order.createdAt}</td>
                    <td>{`$${order.totalPrice}`}</td>
                    <td>
                      {order.isPaid ? `Paid At ${order.paidAt}` : 'Not Paid'}
                    </td>
                    <td>
                      {order.isDelivered
                        ? `Delivered At ${order.deliveredAt}`
                        : 'Not Delivered'}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => router.push(`/order/${order._id}`)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>
              Order History is Empty !!&nbsp;
              <NextLink href="/">
                <a>Go Shopping</a>
              </NextLink>
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrderHistory;
