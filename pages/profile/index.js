import { useSelector, useDispatch } from 'react-redux';
import actions from '../../redux/actions';
import Layout from '../../components/Layout';
import styles from './style.module.scss';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getError } from '../../utils/helpers';
import { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import { useForm } from 'react-hook-form';
import { profileSchema } from '../../utils/yupSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '../../components/Button';

const Profile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userReducer);
  useEffect(() => {
    dispatch(actions.removeAlert());
  }, []);
  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
  });
  const [userState, setUserState] = useState(user);
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
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setValue('name', user.name);
      setValue('email', user.email);
      setUserState(user);
    }
  }, [user]);
  const submitHandler = async (userData) => {
    try {
      const { data } = await axios.put(`/api/users/${user._id}`, userData, {
        headers: { authorization: `Bearer ${userState.token}` },
      });
      dispatch(actions.userLogin({ ...data._doc, token: user.token }));
      dispatch(actions.showAlert('Updated Successfully', 'success'));
    } catch (err) {
      dispatch(actions.showAlert(getError(err), 'error'));
    }
  };
  return (
    <Layout title="User Profile">
      <div className={styles.container}>
        <Modal />
        <div className={styles.control}>
          <ul className={styles.menu}>
            <li className={styles.selected}>User Profile</li>
            <div className={styles.line}></div>
            <li onClick={() => router.push('/order-history')}>Order History</li>
          </ul>
        </div>
        <div className={styles.formContainer}>
          <h2 className={styles.title}>Profile</h2>
          <div className={styles.line} />
          {/* form start */}
          <form onSubmit={handleSubmit((userData) => submitHandler(userData))}>
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
            <Button className={styles.submitButton} type="submit">
              Update
            </Button>
          </form>
          {/* form end */}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
