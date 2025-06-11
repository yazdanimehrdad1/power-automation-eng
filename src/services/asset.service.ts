import { PrismaClient, Asset } from '@prisma/client';
import { Cache } from '../utils/cache.decorator';
import { RedisUtils } from '../utils/redis.utils';

export class AssetService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  @Cache({ keyPrefix: 'assets', ttl: 3600 })
  async getAllAssets(): Promise<Asset[]> {
    return this.prisma.asset.findMany();
  }

  @Cache({ keyPrefix: 'asset', ttl: 3600 })
  async getAssetById(id: string): Promise<Asset | null> {
    return this.prisma.asset.findUnique({
      where: { id }
    });
  }

  @Cache({ keyPrefix: 'assets', ttl: 1800 })
  async getAssetsBySiteId(siteId: string): Promise<Asset[]> {
    return this.prisma.asset.findMany({
      where: {
        belongsToId: siteId
      }
    });
  }

  async createAsset(data: Omit<Asset, 'id' | 'createdAt'>): Promise<Asset> {
    const asset = await this.prisma.asset.create({
      data
    });

    // Invalidate related caches
    await Promise.all([
      RedisUtils.delete('assets:getAllAssets:[]'),
      data.belongsToId && RedisUtils.delete(`assets:getAssetsBySiteId:["${data.belongsToId}"]`)
    ]);

    return asset;
  }

  async updateAsset(id: string, data: Partial<Asset>): Promise<Asset> {
    const oldAsset = await this.prisma.asset.findUnique({
      where: { id }
    });

    const asset = await this.prisma.asset.update({
      where: { id },
      data
    });

    // Invalidate related caches
    await Promise.all([
      RedisUtils.delete(`asset:getAssetById:["${id}"]`),
      RedisUtils.delete('assets:getAllAssets:[]'),
      oldAsset?.belongsToId && RedisUtils.delete(`assets:getAssetsBySiteId:["${oldAsset.belongsToId}"]`),
      data.belongsToId && RedisUtils.delete(`assets:getAssetsBySiteId:["${data.belongsToId}"]`)
    ]);

    return asset;
  }

  async deleteAsset(id: string): Promise<Asset> {
    const asset = await this.prisma.asset.delete({
      where: { id }
    });

    // Invalidate related caches
    await Promise.all([
      RedisUtils.delete(`asset:getAssetById:["${id}"]`),
      RedisUtils.delete('assets:getAllAssets:[]'),
      asset.belongsToId && RedisUtils.delete(`assets:getAssetsBySiteId:["${asset.belongsToId}"]`)
    ]);

    return asset;
  }

  // Example of a complex query with caching
  @Cache({ keyPrefix: 'assets', ttl: 1800 })
  async getAssetsWithSite(): Promise<Asset[]> {
    return this.prisma.asset.findMany({
      include: {
        belongsTo: true
      }
    });
  }

  // Example of a filtered query with cache
  @Cache({ keyPrefix: 'assets', ttl: 1800 })
  async getAssetsByType(assetType: string): Promise<Asset[]> {
    return this.prisma.asset.findMany({
      where: {
        assetType: {
          contains: assetType,
          mode: 'insensitive'
        }
      }
    });
  }
} 