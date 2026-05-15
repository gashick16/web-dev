import Redis from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionsService {
    constructor(
        @Inject('REDIS_CLIENT') private readonly redis: Redis,
        private readonly config: ConfigService,
    ) {}

    async create(createSessionDto: CreateSessionDto, ttl?: number) {
        const { userId } = createSessionDto;
        const key = `sess:${userId}`;
        const timeToLife = ttl ? ttl : this.config.get<number>('TTL_SECONDS') || 3600;

        await this.redis.setex(key, timeToLife, JSON.stringify(createSessionDto));

        return key;
    }

    async getSessionById(id: string) {
        const tokens = await this.redis.get(id);

        if(tokens) return JSON.parse(tokens);

        return { access_token: null, refresh_token: null}
    }

    async updateSession(userId: string, data: CreateSessionDto) {
        const key = `sess:${userId}`;
        await this.redis.set(key, JSON.stringify(data), 'KEEPTTL');
    }

    async deleteSession(userId: string) {
        const key = `sess:${userId}`;

        await this.redis.del(key);
    }
}
