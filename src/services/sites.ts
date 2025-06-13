import { PrismaClient } from '@prisma/client';
import prisma from '../config/prisma';
import { RedisUtils } from '../utils/redis.utils';

type SiteWithAssets = {
  id: string;
  createdAt: Date;
  name: string;
  address: string;
  assets: Array<{
    id: string;
    createdAt: Date;
    type: string;
    assetId: string;
    name: string;
    description: string;
    status: string;
    location: string;
    image: string;
    video: string;
    upstreamId: string;
    downstreamId: string;
    upstreamName: string;
    downstreamName: string;
    belongsToId: string | null;
  }>;
};

export class SiteService {
  private prisma: PrismaClient;
  private readonly CACHE_TTL = 3600; // 1 hour in seconds

  constructor() {
    this.prisma = prisma;
  }

  async getAllSites(): Promise<SiteWithAssets[]> {
    const cacheKey = 'sites:getAllSites';
    const cached = await RedisUtils.get<SiteWithAssets[]>(cacheKey);
    if (cached) return cached;

    const sites = await this.prisma.site.findMany({
      include: {
        assets: true
      }
    });
    
    await RedisUtils.set(cacheKey, sites, this.CACHE_TTL);
    return sites;
  }

  async getSiteById(id: string): Promise<SiteWithAssets | null> {
    const cacheKey = `site:${id}`;
    const cached = await RedisUtils.get<SiteWithAssets>(cacheKey);
    if (cached) return cached;

    const site = await this.prisma.site.findUnique({
      where: { id },
      include: {
        assets: true
      }
    });

    if (site) {
      await RedisUtils.set(cacheKey, site, this.CACHE_TTL);
    }
    
    return site;
  }

  async createSite(data: { name: string; address: string }): Promise<SiteWithAssets> {
    const site = await this.prisma.site.create({
      data,
      include: {
        assets: true
      }
    });

    // Write-through: Update cache immediately
    await Promise.all([
      RedisUtils.set(`site:${site.id}`, site, this.CACHE_TTL),
      // Invalidate the "all sites" cache since it needs to include the new site
      RedisUtils.delete('sites:getAllSites')
    ]);

    return site;
  }

  async updateSite(id: string, data: { name?: string; address?: string }): Promise<SiteWithAssets> {
    const site = await this.prisma.site.update({
      where: { id },
      data,
      include: {
        assets: true
      }
    });

    // Write-through: Update cache immediately
    await Promise.all([
      RedisUtils.set(`site:${site.id}`, site, this.CACHE_TTL),
      // Invalidate the "all sites" cache since it might include the updated site
      RedisUtils.delete('sites:getAllSites')
    ]);

    return site;
  }

  async deleteSite(id: string): Promise<SiteWithAssets> {
    const site = await this.prisma.site.delete({
      where: { id },
      include: {
        assets: true
      }
    });

    // Write-through: Remove from cache immediately
    await Promise.all([
      RedisUtils.delete(`site:${id}`),
      // Invalidate the "all sites" cache since it includes the deleted site
      RedisUtils.delete('sites:getAllSites')
    ]);

    return site;
  }

  // This method is kept for potential bulk operations or manual cache invalidation
  private async invalidateCache(): Promise<void> {
    const keys = await this.prisma.site.findMany({
      select: { id: true }
    });
    
    await Promise.all([
      ...keys.map((site: { id: string }) => RedisUtils.delete(`site:${site.id}`)),
      RedisUtils.delete('sites:getAllSites')
    ]);
  }
} 