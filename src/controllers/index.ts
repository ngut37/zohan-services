import Router from 'koa-router';

import addressRouter from './address';
import authRouter from './auth';
import bookingsRouter from './bookings';
import companiesRouter from './companies';
import servicesRouter from './services';
import staffRouter from './staff';
import testRouter from './test';
import venuesRouter from './venues';

const router = new Router();

router.use(addressRouter.middleware());
router.use(authRouter.middleware());
router.use(bookingsRouter.middleware());
router.use(companiesRouter.middleware());
router.use(servicesRouter.middleware());
router.use(staffRouter.middleware());
router.use(testRouter.middleware());
router.use(venuesRouter.middleware());

export default router;
