import { PrismaClient, Site } from '@prisma/client';
import { Cache } from '../utils/cache.decorator';
import { RedisUtils } from '../utils/redis.utils';

export class SiteService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  @Cache({ keyPrefix: 'sites', ttl: 3600 }) // Cache for 1 hour
  async getAllSites(): Promise<Site[]> {
    return this.prisma.site.findMany();
  }

  @Cache({ keyPrefix: 'site', ttl: 3600 })
  async getSiteById(id: string): Promise<Site | null> {
    return this.prisma.site.findUnique({
      where: { id }
    });
  }

  async createSite(data: Omit<Site, 'id' | 'createdAt'>): Promise<Site> {
    const site = await this.prisma.site.create({
      data
    });
    
    // Invalidate the getAllSites cache
    await RedisUtils.delete('sites:getAllSites:[]');
    
    return site;
  }

  async updateSite(id: string, data: Partial<Site>): Promise<Site> {
    const site = await this.prisma.site.update({
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

  async deleteSite(id: string): Promise<Site> {
    const site = await this.prisma.site.delete({
      where: { id }
    });

    // Invalidate related caches
    await Promise.all([
      RedisUtils.delete(`site:getSiteById:["${id}"]`),
      RedisUtils.delete('sites:getAllSites:[]')
    ]);

    return site;
  }

  // Example of a more complex cached query
  @Cache({ keyPrefix: 'site', ttl: 1800 }) // Cache for 30 minutes
  async getSiteWithAssets(id: string) {
    return this.prisma.site.findUnique({
      where: { id },
      include: {
        assets: true
      }
    });
  }

  // Example of a filtered query with cache
  @Cache({ keyPrefix: 'sites', ttl: 1800 })
  async getSitesByName(name: string): Promise<Site[]> {
    return this.prisma.site.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive'
        }
      }
    });
  }
} 