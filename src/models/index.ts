import mongoose from 'mongoose';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

export const initMongoose = async () => {
  mongoose.set('strictQuery', false);
  mongoose.set('bufferCommands', false);

  mongoose.connection.on('error', (err) => {
    console.error(err);
  });

  try {
    await mongoose.connect(config.get(CONFIG_KEYS.MONGO_URL), {
      autoCreate: true,
      autoIndex: true,
      family: 4,
    });
  } catch (error) {
    console.error(error);
  }
};

export { mongoose };
