import Layout from '../../components/Layout';
import { useEffect } from 'react';
import styles from './style.module.scss';
import { useRouter } from 'next/router';
import actions from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { getError } from '../../utils/helpers';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { shippingSchema } from '../../utils/yupSchema';
import Modal from '../../components/Modal';
import StepWizard from '../../components/StepWizard';
import Button from '../../components/Button';

const Shipping = () => {
  const router = useRouter();
  const { user, shippingAddress } = useSelector((state) => state.userReducer);
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, []);
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(shippingSchema),
  });
  const submitHandler = async (data) => {
    try {
      dispatch(actions.saveShippingAddress(data));
      router.push('/payment');
    } catch (err) {
      dispatch(actions.showAlert(getError(err), 'error'));
    }
  };
  useEffect(() => {
    if (
      errors.fullName ||
      errors.address ||
      errors.city ||
      errors.postalCode ||
      errors.country
    ) {
      dispatch(
        actions.showAlert(
          errors.fullName?.message ||
            errors.address?.message ||
            errors.city?.message ||
            errors.postalCode?.message ||
            errors.country,
          'error'
        )
      );
    }
    if (shippingAddress) {
      setValue('fullName', shippingAddress.fullName);
      setValue('address', shippingAddress.address);
      setValue('city', shippingAddress.city);
      setValue('postalCode', shippingAddress.postalCode);
      setValue('country', shippingAddress.country);
    }
  }, [errors]);
  return (
    <Layout title="Shipping Address">
      <div className={styles.container}>
        <StepWizard activeStep={2} />
        <Modal />
        <div className={styles.titleContainer}>
          <h1>Shipping Address</h1>
        </div>
        <form onSubmit={handleSubmit((data) => submitHandler(data))}>
          <div className={styles.formControl}>
            <label htmlFor="fullName">Full Name</label>
            <input
              placeholder="Enter Full Name"
              type="text"
              name="fullName"
              id="fullName"
              {...register('fullName')}
            />
          </div>
          <div className={styles.formControl}>
            <label htmlFor="address">Address</label>
            <input
              placeholder="Enter Address"
              type="text"
              name="address"
              id="address"
              {...register('address')}
            />
          </div>
          <div className={styles.formControl}>
            <label htmlFor="city">City</label>
            <input
              placeholder="Enter City"
              type="text"
              name="city"
              id="city"
              {...register('city')}
            />
          </div>
          <div className={styles.formControl}>
            <label htmlFor="postalCode">PostalCode</label>
            <input
              placeholder="Enter PostalCode"
              type="number"
              name="postalCode"
              id="postalCode"
              {...register('postalCode')}
            />
          </div>
          <div className={styles.formControl}>
            <label htmlFor="country">Country</label>
            <input
              placeholder="Enter Country"
              type="text"
              name="country"
              id="country"
              {...register('country')}
            />
          </div>
          <Button type="submit">Continue</Button>
        </form>
      </div>
    </Layout>
  );
};

export default Shipping;
