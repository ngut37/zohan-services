import joiRouter from 'koa-joi-router';

import getAvailableSlotRouter from './get-available-slots';
import createRouter from './create';
import getUsersActiveBookingsRouter from './get-users-active-bookings';
import listUsersHistoricBookingsRouter from './list-users-historic-bookings';

const router = joiRouter();

router.prefix('/bookings');

router.use(getAvailableSlotRouter.middleware());
router.use(createRouter.middleware());
router.use(getUsersActiveBookingsRouter.middleware());
router.use(listUsersHistoricBookingsRouter.middleware());

export default router;
