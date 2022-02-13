import { Provider } from 'nconf';
import { Mongoose } from 'mongoose';

import 'mongoose-geojson-schema';

export const mongoose = new Mongoose();

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('autoIndex', true);
mongoose.set('useUnifiedTopology', true);

export let config: Provider;
