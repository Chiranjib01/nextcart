import Layout from '../../../../components-admin/Layout';
import styles from './style.module.scss';
import { useRouter } from 'next/router';
import axios from 'axios';
import actions from '../../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { getError } from '../../../../utils/helpers';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../../../utils/yupSchema';
import { useEffect } from 'react';
import Modal from '../../../../components/Modal';
import Button from '../../../../components/Button';

const AdminLogin = () => {
  const router = useRouter();
  const { adminInfo } = useSelector((state) => state.adminReducer);
  useEffect(() => {
    if (adminInfo) {
      router.push('/admin/dashboard');
    }
  }, []);
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const submitHandler = async (body) => {
    try {
      const { data } = await axios.post(`/api/admin/login`, {
        email: body.email,
        password: body.password,
      });
      dispatch(actions.showAlert('Login Successful', 'success'));
      dispatch(actions.adminLogin(data));
      router.replace('/admin/dashboard');
    } catch (err) {
      dispatch(actions.showAlert(getError(err), 'error'));
    }
  };
  useEffect(() => {
    if (errors.email || errors.password) {
      dispatch(
        actions.showAlert(
          errors.email?.message || errors.password?.message,
          'error'
        )
      );
    }
  }, [errors]);

  return (
    <Layout title="Admin Login">
      <div className={styles.container}>
        <Modal />
        <div className={styles.titleContainer}>
          <h1>Admin Login</h1>
        </div>
        <form onSubmit={handleSubmit((data) => submitHandler(data))}>
          <div className={styles.formControl}>
            <label htmlFor="email">Email</label>
            <input
              placeholder="Enter Email"
              type="email"
              name="email"
              id="email"
              {...register('email')}
            />
          </div>
          <div className={styles.formControl}>
            <label htmlFor="password">Password</label>
            <input
              placeholder="Enter Password"
              type="password"
              name="password"
              id="password"
              {...register('password')}
            />
          </div>
          <Button type="submit">Login</Button>
        </form>
      </div>
    </Layout>
  );
};

export default AdminLogin;
