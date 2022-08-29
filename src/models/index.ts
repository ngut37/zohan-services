import { Mongoose } from 'mongoose';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

export const mongoose = new Mongoose();

export const initMongoose = (callback: () => void) => {
  mongoose.connect(config.get(CONFIG_KEYS.MONGO_URL)).then(() => callback());
};
