import { Router } from 'express';
import sitesRouter from './sites';

const router = Router();

router.use('/sites', sitesRouter);

export default router;