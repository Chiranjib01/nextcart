import Head from 'next/head';
import styles from './style.module.scss';
import Header from '../Header';
import Footer from '../../components/Footer';

const Layout = ({ title, description, children }) => {
  return (
    <>
      <Head>
        <title>{title ? `NextCart - ${title}` : 'NextCart'}</title>
        <meta
          name="description"
          content={description || 'NextCart is an Ecommerce Application'}
        />
        <meta
          name="viewport"
          content="width=device-width,user-scalable=0,initial-scale=1.0,maximum-scale=1.0"
        />
        <link rel="icon" href="favicon.ico" />
      </Head>
      <div className={styles.container}>
        <Header />
        <div className={styles.main}>{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
