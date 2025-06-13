import { Request, Response } from 'express';
import { SiteService } from '../services/sites';

export class SiteController {
  private siteService: SiteService;

  constructor() {
    this.siteService = new SiteService();
  }

  async getAllSites(req: Request, res: Response) {
    try {
      const sites = await this.siteService.getAllSites();
      res.json(sites);
    } catch (error) {
      console.error('Error getting sites:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getSiteById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const site = await this.siteService.getSiteById(id);
      
      if (!site) {
        return res.status(404).json({ error: 'Site not found' });
      }
      
      res.json(site);
    } catch (error) {
      console.error('Error getting site:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createSite(req: Request, res: Response) {
    try {
      const { name, address } = req.body;

      if (!name || !address) {
        return res.status(400).json({ error: 'Name and address are required' });
      }

      const site = await this.siteService.createSite({ name, address });
      res.status(201).json(site);
    } catch (error: any) {
      console.error('Error creating site:', error);
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'A site with this name already exists' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateSite(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, address } = req.body;

      if (!name && !address) {
        return res.status(400).json({ error: 'At least one field (name or address) is required' });
      }

      const site = await this.siteService.updateSite(id, { name, address });
      res.json(site);
    } catch (error: any) {
      console.error('Error updating site:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Site not found' });
      }
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'A site with this name already exists' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteSite(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const site = await this.siteService.deleteSite(id);
      res.json(site);
    } catch (error: any) {
      console.error('Error deleting site:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Site not found' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 