import joiRouter from 'koa-joi-router';

import createReservationRouter from './create-reservation';

const router = joiRouter();

router.prefix('/reservations');

router.use(createReservationRouter.middleware());

export default router;
