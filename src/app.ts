require('dotenv').config();
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';

import Koa from 'koa';

import { config } from '@config/config';
import { initMongoose } from './models';

try {
  const app = new Koa();
  const router = require('./controllers').default;

  const port = config.get('PORT');

  // mongoose connect
  initMongoose()
    .then(() => console.log('Connected to DB!'))
    .catch((err) => console.error(err));

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
} catch (error) {
  console.error(error);
}
