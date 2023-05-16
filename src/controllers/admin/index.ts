import joiRouter from 'koa-joi-router';

import bookingsRouter from './bookings';
import companiesRouter from './companies';
import servicesRouter from './services';
import staffRouter from './staff';
import venuesRouter from './venues';

const router = joiRouter();

router.prefix('/admin');

router.use(bookingsRouter.middleware());
router.use(companiesRouter.middleware());
router.use(servicesRouter.middleware());
router.use(staffRouter.middleware());
router.use(venuesRouter.middleware());

export default router;
