import { Router } from 'express';
import siteRoutes from './sites';

const router = Router();

// Mount routes
router.use('/sites', siteRoutes);

export default router;