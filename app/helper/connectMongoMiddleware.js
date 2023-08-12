import mongoose from 'mongoose';
import config from '../../configs/web.config.js';

// Middleware для установления соединения с MongoDB
const connectMongoMiddleware = () => {
  // Подключение к MongoDB
  mongoose
    .connect(config.mongoURI, config.mongoOptions)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('Failed to connect to MongoDB', error);
    });
};

export default connectMongoMiddleware;
