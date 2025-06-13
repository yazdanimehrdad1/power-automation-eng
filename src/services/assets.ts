import type { Asset } from '../generated/prisma';
import { Cache } from '../utils/cache.decorator';
import { RedisUtils } from '../utils/redis.utils';
import { prisma } from '../config/prisma';

export class AssetService {
  public async getAllAssets(): Promise<Asset[]> {
    const cacheKey = 'assets:getAllAssets:[]';
    const cached = await RedisUtils.get<Asset[]>(cacheKey);
    if (cached) return cached;

    const assets = await prisma.asset.findMany();
    await RedisUtils.set(cacheKey, assets, 3600);
    return assets;
  }

  public async getAssetById(id: string): Promise<Asset | null> {
    const cacheKey = `asset:getAssetById:["${id}"]`;
    const cached = await RedisUtils.get<Asset>(cacheKey);
    if (cached) return cached;

    const asset = await prisma.asset.findUnique({
      where: { id }
    });
    if (asset) {
      await RedisUtils.set(cacheKey, asset, 3600);
    }
    return asset;
  }

  public async getAssetsBySiteId(siteId: string): Promise<Asset[]> {
    const cacheKey = `assets:getAssetsBySiteId:["${siteId}"]`;
    const cached = await RedisUtils.get<Asset[]>(cacheKey);
    if (cached) return cached;

    const assets = await prisma.asset.findMany({
      where: {
        belongsToId: siteId
      }
    });
    await RedisUtils.set(cacheKey, assets, 1800);
    return assets;
  }

  public async createAsset(data: Omit<Asset, 'id' | 'createdAt'>): Promise<Asset> {
    const asset = await prisma.asset.create({
      data
    });

    // Invalidate related caches
    await Promise.all([
      RedisUtils.delete('assets:getAllAssets:[]'),
      data.belongsToId && RedisUtils.delete(`assets:getAssetsBySiteId:["${data.belongsToId}"]`)
    ]);

    return asset;
  }

  public async updateAsset(id: string, data: Partial<Asset>): Promise<Asset> {
    const oldAsset = await prisma.asset.findUnique({
      where: { id }
    });

    const asset = await prisma.asset.update({
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

  public async deleteAsset(id: string): Promise<Asset> {
    const asset = await prisma.asset.delete({
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
  public async getAssetsWithSite(): Promise<(Asset & { belongsTo: any })[]> {
    const cacheKey = 'assets:getAssetsWithSite:[]';
    const cached = await RedisUtils.get<(Asset & { belongsTo: any })[]>(cacheKey);
    if (cached) return cached;

    const assets = await prisma.asset.findMany({
      include: {
        belongsTo: true
      }
    });
    await RedisUtils.set(cacheKey, assets, 1800);
    return assets;
  }

  // Example of a filtered query with cache
  public async getAssetsByType(assetType: string): Promise<Asset[]> {
    const cacheKey = `assets:getAssetsByType:["${assetType}"]`;
    const cached = await RedisUtils.get<Asset[]>(cacheKey);
    if (cached) return cached;

    const assets = await prisma.asset.findMany({
      where: {
        assetType: {
          contains: assetType,
          mode: 'insensitive'
        }
      }
    });
    await RedisUtils.set(cacheKey, assets, 1800);
    return assets;
  }
} 