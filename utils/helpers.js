import db from './db';

export const getError = (err) => {
  return (
    (err.response && err.response.data && err.response.data.message
      ? err.response.data.message
      : err.message) || 'something went wrong'
  );
};

export const onError = async (err, req, res, next) => {
  await db.disconnect();
  res.status(500).send({ message: err.toString() });
};
