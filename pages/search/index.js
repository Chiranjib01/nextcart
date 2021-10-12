import Layout from '../../components/Layout';
import db from '../../utils/db';
import Product from '../../models/Product';
import docToPlain from '../../utils/docToPlain';
import Products from '../../components/Products';
import Loading from '../../components/Loading';

export default function Home({ products, search }) {
  if (!products) {
    return <Loading />;
  }
  return (
    <Layout title="Home">
      <div style={{ marginTop: '50px' }} />
      {search && (
        <article style={{ padding: '0 10px', margin: '10px auto' }}>
          Search : {search}
        </article>
      )}
      <Products title="Products" products={products} />
    </Layout>
  );
}

export const getServerSideProps = async ({ query: { q } }) => {
  const queryString = q || '';
  await db.connect();
  //   perform search operation
  //  searching is performed in name or description
  let products = await Product.aggregate([
    {
      $match: {
        $or: [
          { name: { $regex: queryString, $options: 'i' } },
          { description: { $regex: queryString, $options: 'i' } },
        ],
      },
    },
  ]);
  if (!products) {
    return {
      props: {
        products: [],
        search: queryString,
      },
    };
  }
  await db.disconnect();
  return {
    props: {
      products: products.map((doc) => docToPlain(doc)),
      search: queryString,
    },
  };
};
