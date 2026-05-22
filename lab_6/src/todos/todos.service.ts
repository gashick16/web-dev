import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CacheService } from 'src/cache/cache.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo, TodoDocument } from './todo.schema';

@Injectable()
export class TodosService {
    constructor(
        @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
        private cacheService: CacheService,
        private configService: ConfigService,
    ) {}

    private getListCacheKey(userId: string): string {
        return `wp:todos:list:${userId}`;
    }

    private getItemCacheKey(id: string): string {
        return `wp:todos:item:${id}`;
    }

    async findAll(userId: string): Promise<Todo[]> {
        const cacheKey = this.getListCacheKey(userId);
        const cachedTodos = await this.cacheService.get<Todo[]>(cacheKey);
        if (cachedTodos) {
            return cachedTodos;
        }
        const result = await this.todoModel.find({ 'author.id': userId }).exec();
        const ttl = this.configService.get<number>('CACHE_TTL_DEFAULT', 86400);
        await this.cacheService.set(cacheKey, result, ttl);
        return result;
    }

    async findOne(id: string, userId: string): Promise<Todo | null> {
        const cacheKey = this.getItemCacheKey(id);
        const cachedTodo = await this.cacheService.get<Todo>(cacheKey);
        if (cachedTodo) {
            return cachedTodo;
        }
        const result = await this.todoModel.findOne({ _id: id, 'author.id': userId }).exec();
        const ttl = this.configService.get<number>('CACHE_TTL_DEFAULT', 86400);
        await this.cacheService.set(cacheKey, result, ttl);
        return result;
    }

    async create(createTodoDto: CreateTodoDto) {
        const todo = new this.todoModel(createTodoDto);
        const result = await todo.save();
        await this.invalidateListCache(String(result.author.id));
        return result;
    }

    async update(id: string, userId: string, updateTodoDto: UpdateTodoDto) {
        await this.todoModel.updateOne({ _id: id, 'author.id': userId }, updateTodoDto).exec();
        await this.invalidateItemCache(id);
        await this.invalidateListCache(userId);
        return await this.todoModel.findOne({ _id: id, 'author.id': userId }).exec();
    }

    async delete(id: string, userId: string) {
        await this.todoModel.updateOne({ _id: id, 'author.id': userId }, { deletedAt: new Date() }).exec();
        await this.invalidateItemCache(id);
        await this.invalidateListCache(userId);
        return await this.todoModel.find({ _id: id, 'author.id': userId }).exec();
    }

    private async invalidateListCache(userId: string) {
        const pattern = `wp:todos:list:${userId}`;
        await this.cacheService.delByPattern(pattern);
    }

    private async invalidateItemCache(id: string) {
        const pattern = `wp:todos:item:${id}`;
        await this.cacheService.delByPattern(pattern);
    }
}