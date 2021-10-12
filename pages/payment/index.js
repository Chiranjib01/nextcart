import { useSelector, useDispatch } from 'react-redux';
import Layout from '../../components/Layout';
import styles from './style.module.scss';
import actions from '../../redux/actions';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import StepWizard from '../../components/StepWizard';

const PaymentMethod = () => {
  const { user, paymentMethod } = useSelector((state) => state.userReducer);
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, []);
  const [method, setMethod] = useState(paymentMethod);
  const submitHandler = (e) => {
    e.preventDefault();
    if (!method) {
      dispatch(actions.showAlert('Payment Method Is Required', 'error'));
    } else {
      dispatch(actions.savePaymentMethod(method));
      router.push('/placeorder');
    }
  };
  return (
    <Layout title="Payment Method">
      <div className={styles.container}>
        <StepWizard activeStep={3} />
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Payment Method</h1>
        </div>
        <Modal />
        <form onSubmit={submitHandler}>
          <div className={styles.formControl}>
            <input
              name="method"
              id="paypal"
              type="radio"
              value="paypal"
              onChange={(e) => setMethod(e.target.value)}
              checked={method === 'paypal'}
            />
            <label htmlFor="paypal">Paypal/Debit Card/Credit Card</label>
          </div>
          <div className={styles.formControl}>
            <input
              name="method"
              id="cash"
              type="radio"
              value="cash"
              checked={method === 'cash'}
              onChange={(e) => setMethod(e.target.value)}
            />
            <label htmlFor="cash">Cash On Delivery</label>
          </div>
          <button className={styles.submitButton} type="submit">
            Continue
          </button>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => router.push('/shipping')}
          >
            Go Back
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default PaymentMethod;
