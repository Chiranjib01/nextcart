import mongoose from 'mongoose';

const connection = {};

const connect = async () => {
  if (connection.isConnected) {
    console.log('Use Previous Connection');
    return;
  }
  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
  });
  connection.isConnected = conn.connections[0].readyState;
  console.log('New connection');
};

const disconnect = async () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Not disconnected');
    return;
  }
  await mongoose.disconnect();
  connection.isConnected = 0;
};

export default { connect, disconnect };
