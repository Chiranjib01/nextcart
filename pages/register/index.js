import Layout from '../../components/Layout';
import { useEffect } from 'react';
import styles from './style.module.scss';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import actions from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { getError } from '../../utils/helpers';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../../utils/yupSchema';
import Modal from '../../components/Modal';
import Button from '../../components/Button';

const Register = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.userReducer);
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, []);
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const submitHandler = async (body) => {
    try {
      const { data } = await axios.post(`/api/user/register`, {
        name: body.name,
        email: body.email,
        password: body.password,
      });
      dispatch(actions.showAlert(data.message, 'success'));
      router.replace(`/login?es=true&emailSentTo=${body.email}`);
    } catch (err) {
      dispatch(actions.showAlert(getError(err), 'error'));
    }
  };
  useEffect(() => {
    if (
      errors.name ||
      errors.email ||
      errors.password ||
      errors.confirmPassword
    ) {
      dispatch(
        actions.showAlert(
          errors.name?.message ||
            errors.email?.message ||
            errors.password?.message ||
            errors.confirmPassword?.message,
          'error'
        )
      );
    }
  }, [errors]);
  return (
    <Layout title="Register">
      <div className={styles.container}>
        <Modal />
        <div className={styles.titleContainer}>
          <h1>Register</h1>
        </div>
        <form onSubmit={handleSubmit((data) => submitHandler(data))}>
          <div className={styles.formControl}>
            <label htmlFor="name">Name</label>
            <input
              placeholder="Enter Name"
              type="name"
              name="name"
              id="name"
              {...register('name')}
            />
          </div>
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
          <div className={styles.formControl}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              placeholder="Confirm Password"
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              {...register('confirmPassword')}
            />
          </div>
          <Button type="submit">Register</Button>
          <p>
            Already Have An Account ?&nbsp;
            <NextLink href="/login">
              <a>Login</a>
            </NextLink>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
