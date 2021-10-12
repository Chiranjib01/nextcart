import styles from './style.module.scss';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import db from '../../../utils/db';
import User from '../../../models/User';
import Product from '../../../models/Product';
import Order from '../../../models/Order';
import Layout from '../../../components-admin/Layout';
import Loading from '../../../components/Loading';

const Dashboard = ({ productDetails }) => {
  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [data, setData] = useState(null);
  const { adminInfo } = useSelector((state) => state.adminReducer);
  useEffect(() => {
    if (!adminInfo) {
      router.push('/');
    } else {
      setIsPageLoading(false);
    }
    if (productDetails) {
      setData(productDetails);
    }
  }, [adminInfo, productDetails]);

  return (
    <Layout title="Admin Dashboard">
      <div className={styles.container}>
        {isPageLoading ? (
          <Loading />
        ) : (
          <>
            <div className={styles.control}>
              <ul className={styles.menu}>
                <article>
                  <li className={styles.selected}>Dashboard</li>
                  <div className={styles.line}></div>
                </article>
                <article>
                  <li onClick={() => router.push('/admin/orders')}>Orders</li>
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
            <div className={styles.dashboardContainer}>
              <h2 className={styles.title}>Dashboard</h2>
              <div className={styles.line}></div>
              {/* Dashboard */}
              <article className={styles.dashboard}>
                <div>
                  <h2>${data.total}</h2>
                  <span>Sales</span>
                  <button onClick={() => router.push('/admin/orders')}>
                    View Sales
                  </button>
                </div>
                <div>
                  <h2>{data.numOfOrders}</h2>
                  <span>Orders</span>
                  <button onClick={() => router.push('/admin/orders')}>
                    View Orders
                  </button>
                </div>
                <div>
                  <h2>{data.numOfProducts}</h2>
                  <span>Products</span>
                  <button onClick={() => router.push('/admin/products')}>
                    View Products
                  </button>
                </div>
                <div>
                  <h2>{data.numOfUsers}</h2>
                  <span>Users</span>
                  <button onClick={() => router.push('/admin/users')}>
                    View Users
                  </button>
                </div>
              </article>
              {/* end */}
              {/* chart */}
              {/* end */}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps = async () => {
  await db.connect();
  const orders = await Order.find({}).lean();
  const total = orders.reduce((a, c) => a + c.totalPrice, 0);
  const numOfOrders = await Order.count();
  const numOfProducts = await Product.count();
  const numOfUsers = await User.count();
  await db.disconnect();
  const productDetails = { total, numOfOrders, numOfProducts, numOfUsers };
  return {
    props: { productDetails },
  };
};

export default Dashboard;
