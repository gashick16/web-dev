import { Injectable, Logger, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly defaultTTL: number;

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {
    this.defaultTTL = this.configService.get<number>('CACHE_TTL_DEFAULT', 86400);
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      this.logger.error(`Ошибка при получении ключа ${key}: ${error.message}`);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      const ttlSeconds = ttl || this.defaultTTL;
      await this.redis.set(key, serialized, 'EX', ttlSeconds);
      this.logger.debug(`Кеш сохранен: ${key} (TTL: ${ttlSeconds}с)`);
    } catch (error) {
      this.logger.error(`Ошибка при сохранении ключа ${key}: ${error.message}`);
    }
  }

  async delByPattern(pattern: string): Promise<void> {
    try {
      let cursor = '0';
      const keysToDelete: string[] = [];
      
      do {
        const reply = await this.redis.scan(
          cursor,
          'MATCH',
          pattern,
          'COUNT',
          '100'
        );
        cursor = reply[0];
        const keys = reply[1];
        
        if (keys.length > 0) {
          keysToDelete.push(...keys);
        }
      } while (cursor !== '0');
      
      if (keysToDelete.length > 0) {
        await this.redis.del(...keysToDelete);
        this.logger.debug(`Удалено ${keysToDelete.length} ключей по шаблону: ${pattern}`);
      }
    } catch (error) {
      this.logger.error(`Ошибка при удалении по шаблону ${pattern}: ${error.message}`);
    }
  }
}