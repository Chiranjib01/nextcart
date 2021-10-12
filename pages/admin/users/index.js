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
      return { ...state, loading: false, error: '', users: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const Users = () => {
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
  const [{ loading, users, error }, dispatch] = useReducer(reducer, {
    loading: true,
    users: [],
    error: '',
  });
  const fetchUsers = async () => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await axios.get(`/api/admin/users`, {
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
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (confirm('Confirm ?')) {
      const { data } = await axios.delete(`/api/admin/users/${id}`, {
        headers: {
          authorization: `Bearer ${adminInfo.token}`,
          admin: adminInfo.email,
        },
      });
      alertDispatch(actions.showAlert(data.message, 'success'));
      fetchUsers();
    }
  };

  return (
    <Layout title="Admin Users">
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
                  <li onClick={() => router.push('/admin/products')}>
                    Products
                  </li>
                  <div className={styles.line}></div>
                </article>
                <article>
                  <li className={styles.selected}>Users</li>
                  <div className={styles.line}></div>
                </article>
              </ul>
            </div>
            <div className={styles.tableContainer}>
              <h2 className={styles.title}>Users</h2>
              <div className={styles.line}></div>
              {loading ? (
                <Loading />
              ) : error ? (
                <div className={styles.errorBox}>{error}</div>
              ) : users.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th className={styles.textCenter}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user._id.slice(20)}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td className={styles.buttonContainer}>
                          <button
                            type="button"
                            onClick={() =>
                              router.push(`/admin/user/${user._id}/edit`)
                            }
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteUser(user._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No User !!&nbsp;</p>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Users;
