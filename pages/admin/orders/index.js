import styles from './style.module.scss';
import { useRouter } from 'next/router';
import { useEffect, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../../components-admin/Layout';
import Loading from '../../../components/Loading';
import { getError } from '../../../utils/helpers';
import axios from 'axios';

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

const Orders = () => {
  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { adminInfo } = useSelector((state) => state.adminReducer);
  useEffect(() => {
    if (!adminInfo) {
      router.push('/');
    } else {
      setIsPageLoading(false);
    }
  }, [adminInfo]);
  const [{ loading, orders, error }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/orders`, {
          headers: {
            authorization: `Bearer ${adminInfo.token}`,
            admin: adminInfo.email,
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
    <Layout title="Admin Orders">
      <div className={styles.container}>
        {isPageLoading ? (
          <Loading />
        ) : (
          <>
            <div className={styles.control}>
              <ul className={styles.menu}>
                <article>
                  <li onClick={() => router.push('/admin/dashboard')}>
                    Dashboard
                  </li>
                  <div className={styles.line}></div>
                </article>
                <article>
                  <li className={styles.selected}>Orders</li>
                  <div className={styles.line}></div>
                </article>
                <article>
                  <li onClick={() => router.push('/admin/products')}>
                    Products
                  </li>
                  <div className={styles.line}></div>
                </article>
                <article>
                  <li onClick={() => router.push('/admin/users')}>Users</li>
                  <div className={styles.line}></div>
                </article>
              </ul>
            </div>
            <div className={styles.tableContainer}>
              <h2 className={styles.title}>Orders</h2>
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
                      <th>User</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Paid</th>
                      <th>Delivered</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id.slice(20)}</td>
                        <td>{order.shippingAddress.fullName}</td>
                        <td>{order.createdAt}</td>
                        <td>${order.totalPrice}</td>
                        <td>
                          {order.isPaid
                            ? `Paid At ${order.paidAt}`
                            : 'Not Paid'}
                        </td>
                        <td>
                          {order.isDelivered
                            ? `Delivered At ${order.deliveredAt}`
                            : 'Not Delivered'}
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() =>
                              router.push(`/admin/order/${order._id}`)
                            }
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No Order !!&nbsp;</p>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
