import Router from 'koa-router';

import addressRouter from './address';
import authRouter from './auth';
import companiesRouter from './companies';
import reservationsRouter from './reservations';
import servicesRouter from './services';
import staffRouter from './staff';
import venuesRouter from './venues';
import testRouter from './test';

const router = new Router();

router.use(addressRouter.middleware());
router.use(authRouter.middleware());
router.use(companiesRouter.middleware());
router.use(reservationsRouter.middleware());
router.use(servicesRouter.middleware());
router.use(staffRouter.middleware());
router.use(venuesRouter.middleware());
router.use(testRouter.middleware());

export default router;
