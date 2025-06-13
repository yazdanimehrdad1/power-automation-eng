import { PrismaClient, Site } from '@prisma/client';
import { Cache } from '../utils/cache.decorator';
import prisma from '../config/prisma';

export class SiteService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  @Cache({ keyPrefix: 'sites', ttl: 3600 })
  async getAllSites(): Promise<Site[]> {
    return this.prisma.site.findMany({
      include: {
        assets: true
      }
    });
  }

  @Cache({ keyPrefix: 'site', ttl: 3600 })
  async getSiteById(id: string): Promise<Site | null> {
    return this.prisma.site.findUnique({
      where: { id },
      include: {
        assets: true
      }
    });
  }

  async createSite(data: { name: string; address: string }): Promise<Site> {
    return this.prisma.site.create({
      data,
      include: {
        assets: true
      }
    });
  }

  async updateSite(id: string, data: { name?: string; address?: string }): Promise<Site> {
    return this.prisma.site.update({
      where: { id },
      data,
      include: {
        assets: true
      }
    });
  }

  async deleteSite(id: string): Promise<Site> {
    return this.prisma.site.delete({
      where: { id },
      include: {
        assets: true
      }
    });
  }
} 