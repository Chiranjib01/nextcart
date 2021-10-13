import Layout from '../components/Layout';
import db from '../utils/db';
import Product from '../models/Product';
import docToPlain from '../utils/docToPlain';
import Products from '../components/Products';
import Loading from '../components/Loading';

export default function Home({ products }) {
  if (!products) {
    return <Loading />;
  }
  return (
    <Layout title="Home">
      <div style={{ marginTop: '50px' }} />
      <Products title="Products" products={products} />
    </Layout>
  );
}

export const getServerSideProps = async () => {
  await db.connect();
  const products = await Product.find({}).lean();
  await db.disconnect();
  return {
    props: {
      products: products.map((doc) => docToPlain(doc)),
    },
  };
};
