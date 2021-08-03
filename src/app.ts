import Koa from 'koa';

import { config } from './config';

try {
  const app = new Koa();
  const router = require('./controllers').default;

  const port = config.get('PORT');

  app.use(router.routes());
  app.listen(port);

  console.clear();
  console.log(`💈 Zohan services listening on port: ${port} 🎧`);
} catch (e) {
  console.error(e);
}
