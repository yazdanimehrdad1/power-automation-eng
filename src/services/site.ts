import type { Site } from '../generated/prisma';
import { Cache } from '../utils/cache.decorator';
import { RedisUtils } from '../utils/redis.utils';
import { prisma } from '../config/prisma';

// Remove decorators temporarily until we fix the decorator implementation
export class SiteService {
  public async getAllSites(): Promise<Site[]> {
    const cacheKey = 'sites:getAllSites:[]';
    const cached = await RedisUtils.get<Site[]>(cacheKey);
    if (cached) return cached;

    const sites = await prisma.site.findMany();
    await RedisUtils.set(cacheKey, sites, 3600);
    return sites;
  }

  public async getSiteById(id: string): Promise<Site | null> {
    const cacheKey = `site:getSiteById:["${id}"]`;
    const cached = await RedisUtils.get<Site>(cacheKey);
    if (cached) return cached;

    const site = await prisma.site.findUnique({
      where: { id }
    });
    if (site) {
      await RedisUtils.set(cacheKey, site, 3600);
    }
    return site;
  }

  public async createSite(data: Omit<Site, 'id' | 'createdAt'>): Promise<Site> {
    const site = await prisma.site.create({
      data
    });
    
    // Invalidate the getAllSites cache
    await RedisUtils.delete('sites:getAllSites:[]');
    
    return site;
  }

  public async updateSite(id: string, data: Partial<Site>): Promise<Site> {
    const site = await prisma.site.update({
      where: { id },
      data
    });

    // Invalidate related caches
    await Promise.all([
      RedisUtils.delete(`site:getSiteById:["${id}"]`),
      RedisUtils.delete('sites:getAllSites:[]')
    ]);

    return site;
  }

  public async deleteSite(id: string): Promise<Site> {
    const site = await prisma.site.delete({
      where: { id }
    });

    // Invalidate related caches
    await Promise.all([
      RedisUtils.delete(`site:getSiteById:["${id}"]`),
      RedisUtils.delete('sites:getAllSites:[]')
    ]);

    return site;
  }

  public async getSiteWithAssets(id: string) {
    const cacheKey = `site:getSiteWithAssets:["${id}"]`;
    const cached = await RedisUtils.get<Site & { assets: any[] }>(cacheKey);
    if (cached) return cached;

    const site = await prisma.site.findUnique({
      where: { id },
      include: {
        assets: true
      }
    });
    if (site) {
      await RedisUtils.set(cacheKey, site, 1800);
    }
    return site;
  }

  public async getSitesByName(name: string): Promise<Site[]> {
    const cacheKey = `sites:getSitesByName:["${name}"]`;
    const cached = await RedisUtils.get<Site[]>(cacheKey);
    if (cached) return cached;

    const sites = await prisma.site.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive'
        }
      }
    });
    await RedisUtils.set(cacheKey, sites, 1800);
    return sites;
  }
} 