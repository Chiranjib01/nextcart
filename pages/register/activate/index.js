import Layout from '../../../components/Layout';
import { useEffect, useState } from 'react';
import styles from './style.module.scss';
import { useRouter } from 'next/router';
import axios from 'axios';
import { getError } from '../../../utils/helpers';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';

const Activate = () => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = router.query;
  useEffect(() => {
    const activate = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post(`/api/user/activate`, {
          token,
        });
        setMessage(data.message);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setMessage(getError(err));
      }
    };
    if (token) {
      activate();
    }
  }, []);
  const clickHandler = async () => {
    router.replace(`/login`);
  };
  return (
    <Layout title="Activate Account">
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <h1>Account Activation</h1>
        </div>
        <div className={styles.main}>
          {loading ? <Loading /> : message && <article>{message}</article>}
          <Button onClick={clickHandler} type="button">
            Go To Login
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Activate;
