require('dotenv').config();
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';

import Koa from 'koa';
import { connect } from 'mongoose';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

try {
  const app = new Koa();
  const router = require('./controllers').default;

  const port = config.get('PORT');

  // mongoose connect
  connect(
    config.get(CONFIG_KEYS.MONGO_URL),
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Connected to DB!'),
  );

  app.use(
    cors({
      credentials: true,
    }),
  );

  app.use(
    bodyParser({
      enableTypes: ['json'],
    }),
  );

  app.use(router.routes());
  app.use(router.allowedMethods());
  app.listen(port);

  console.log(`💈 Zohan services listening on port: ${port} 🎧`);
} catch (e) {
  console.error(e);
}
