import { Router, RequestHandler } from 'express';
import { SiteController } from '../controllers/sitesController';

const router = Router();
const siteController = new SiteController();

// Get all sites
router.get('/', (siteController.getAllSites as RequestHandler).bind(siteController));

// Get site by ID
router.get('/:id', (siteController.getSiteById as RequestHandler).bind(siteController));

// Create new site
router.post('/', (siteController.createSite as RequestHandler).bind(siteController));

// Update site
router.put('/:id', (siteController.updateSite as RequestHandler).bind(siteController));

// Delete site
router.delete('/:id', (siteController.deleteSite as RequestHandler).bind(siteController));

export default router;
