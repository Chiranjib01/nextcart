import Layout from '../../components/Layout';
import styles from './style.module.scss';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import actions from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { getError } from '../../utils/helpers';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../utils/yupSchema';
import { useEffect } from 'react';
import Modal from '../../components/Modal';
import Button from '../../components/Button';

const Login = () => {
  const router = useRouter();
  const { redirect, es, emailSentTo } = router.query;
  const { user } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.removeAlert());
    if (user) {
      router.push('/');
    }
  }, []);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const submitHandler = async (body) => {
    try {
      const { data } = await axios.post(`/api/user/login`, {
        email: body.email,
        password: body.password,
      });
      dispatch(actions.showAlert('Login Successful', 'success'));
      dispatch(actions.userLogin(data));
      router.replace(redirect || '/');
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
    <Layout title="Login">
      <div className={styles.container}>
        <Modal />
        <div className={styles.titleContainer}>
          <h1>Login</h1>
          {emailSentTo && es === 'true' && (
            <article className={styles.emailSent}>
              Verification Email Is Sent To{' '}
              {`${emailSentTo.slice(0, 3)}*****${emailSentTo.slice(
                15,
                emailSentTo.length
              )}`}
              . First Activate Your Account , Then Login .
            </article>
          )}
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
          <p>
            Don't Have An Account ?&nbsp;
            <NextLink href="/register">
              <a>Register</a>
            </NextLink>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
