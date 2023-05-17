import joiRouter from 'koa-joi-router';

import getAvailableSlotRouter from './get-available-slot';

const router = joiRouter();

router.prefix('/bookings');

router.use(getAvailableSlotRouter.middleware());

export default router;
