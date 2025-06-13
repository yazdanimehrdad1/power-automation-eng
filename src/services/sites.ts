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

  constructor() {
    this.prisma = prisma;
  }

  async getAllSites(): Promise<SiteWithAssets[]> {
    // TODO: Implement caching
    return this.prisma.site.findMany({
      include: {
        assets: true
      }
    });
  }

  async getSiteById(id: string): Promise<SiteWithAssets | null> {
    // TODO: Implement caching
    return this.prisma.site.findUnique({
      where: { id },
      include: {
        assets: true
      }
    });
  }

  async createSite(data: { name: string; address: string }): Promise<SiteWithAssets> {
    const site = await this.prisma.site.create({
      data,
      include: {
        assets: true
      }
    });
    // Invalidate cache after create
    await this.invalidateCache();
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
    // Invalidate cache after update
    await this.invalidateCache();
    return site;
  }

  async deleteSite(id: string): Promise<SiteWithAssets> {
    const site = await this.prisma.site.delete({
      where: { id },
      include: {
        assets: true
      }
    });
    // Invalidate cache after delete
    await this.invalidateCache();
    return site;
  }

  private async invalidateCache(): Promise<void> {
    // Invalidate all site-related caches
    const keys = await this.prisma.site.findMany({
      select: { id: true }
    });
    
    for (const site of keys) {
      await RedisUtils.delete(`site:${site.id}`);
    }
    await RedisUtils.delete('sites:getAllSites');
  }
} 