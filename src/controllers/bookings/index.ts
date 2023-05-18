import joiRouter from 'koa-joi-router';

import getAvailableSlotRouter from './get-available-slot';
import createRouter from './create';

const router = joiRouter();

router.prefix('/bookings');

router.use(getAvailableSlotRouter.middleware());
router.use(createRouter.middleware());

export default router;
