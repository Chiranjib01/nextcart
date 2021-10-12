import styles from './style.module.scss';
import { useRouter } from 'next/router';
import { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../../components-admin/Layout';
import Loading from '../../../components/Loading';
import axios from 'axios';
import actions from '../../../redux/actions';
import { getError } from '../../../utils/helpers';
import Modal from '../../../components/Modal';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '', products: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const Products = () => {
  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { adminInfo } = useSelector((state) => state.adminReducer);
  useEffect(() => {
    if (!adminInfo) {
      router.push('/');
    } else {
      setIsPageLoading(false);
    }
  }, []);
  const alertDispatch = useDispatch();
  const [{ loading, products, error }, dispatch] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  });
  const fetchProducts = async () => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await axios.get(`/api/admin/products`, {
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
  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (confirm('Confirm ?')) {
      const { data } = await axios.delete(`/api/admin/products/${id}`, {
        headers: {
          authorization: `Bearer ${adminInfo.token}`,
          admin: adminInfo.email,
        },
      });
      alertDispatch(actions.showAlert(data.message, 'success'));
      fetchProducts();
    }
  };

  return (
    <Layout title="Admin Products">
      <div className={styles.container}>
        <Modal />
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
                  <li onClick={() => router.push('/admin/orders')}>Orders</li>
                  <div className={styles.line}></div>
                </article>
                <article>
                  <li className={styles.selected}>Products</li>
                  <div className={styles.line}></div>
                </article>
                <article>
                  <li onClick={() => router.push('/admin/users')}>Users</li>
                  <div className={styles.line}></div>
                </article>
              </ul>
            </div>
            <div className={styles.tableContainer}>
              <h2 className={`${styles.title} ${styles.inline}`}>Products </h2>
              <button
                onClick={() => router.push(`/admin/product/create`)}
                className={styles.createButton}
              >
                Create
              </button>
              <div className={styles.line}></div>
              {loading ? (
                <Loading />
              ) : error ? (
                <div className={styles.errorBox}>{error}</div>
              ) : products.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Count</th>
                      <th>Rating</th>
                      <th className={styles.textCenter}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>{product._id.slice(20)}</td>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{product.category}</td>
                        <td>{product.countInStock}</td>
                        <td>{product.rating}</td>
                        <td className={styles.buttonContainer}>
                          <button
                            type="button"
                            onClick={() =>
                              router.push(`/admin/product/${product._id}/edit`)
                            }
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(product._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No Product !!&nbsp;</p>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Products;
