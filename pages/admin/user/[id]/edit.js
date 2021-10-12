import Layout from '../../../../components-admin/Layout';
import styles from './style.module.scss';
import { useRouter } from 'next/router';
import axios from 'axios';
import actions from '../../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { getError } from '../../../../utils/helpers';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { editUserSchema } from '../../../../utils/yupSchema';
import { useEffect } from 'react';
import Modal from '../../../../components/Modal';
import Button from '../../../../components/Button';
import db from '../../../../utils/db';
import User from '../../../../models/User';

const EditUser = ({ id: userId, name: userName }) => {
  const router = useRouter();
  const { adminInfo } = useSelector((state) => state.adminReducer);
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editUserSchema),
  });
  const submitHandler = async (body) => {
    try {
      const { data } = await axios.put(
        `/api/admin/users/${userId}`,
        {
          name: body.name,
        },
        {
          headers: {
            authorization: `Bearer ${adminInfo.token}`,
            admin: adminInfo.email,
          },
        }
      );
      dispatch(actions.showAlert(data.message, 'success'));
    } catch (err) {
      dispatch(actions.showAlert(getError(err), 'error'));
    }
  };
  useEffect(() => {
    if (!adminInfo) {
      router.push('/');
    }
    setValue('name', userName);
  }, []);

  useEffect(() => {
    if (errors.name) {
      dispatch(actions.showAlert(errors.name?.message, 'error'));
    }
  }, [errors]);

  return (
    <Layout title="Edit User">
      <div className={styles.container}>
        <Modal />
        <div className={styles.titleContainer}>
          <h1>Edit User</h1>
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
          <Button type="submit">Edit</Button>
        </form>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async ({ params: { id } }) => {
  await db.connect();
  const { name } = await User.findById(id).lean();
  await db.disconnect();
  return {
    props: {
      name,
      id,
    },
  };
};
export default EditUser;
