import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(Todo)
        private todosRepository: Repository<Todo>,
    ) {}

    findAll(userId: string): Promise<Todo[]> {
        return this.todosRepository.find({
            where: {
                author: {
                    id: userId,
                }
            }
        });
    }

    findOne(id: string, userId: string): Promise<Todo | null> {
        return this.todosRepository.findOneBy({ id, author: { id: userId } });
    }

    async create(createTodoDto: CreateTodoDto) {
        const todo = this.todosRepository.create(createTodoDto);
        return await this.todosRepository.save(todo);
    }

    async update(id: string, userId: string, updateTodoDto: UpdateTodoDto) {
        await this.todosRepository.update({ id, author: { id: userId }}, updateTodoDto);
        return await this.todosRepository.findOneBy({ id, author: { id: userId }});
    }

    async delete(id: string, userId: string) {
        await this.todosRepository.softDelete({ id, author: { id: userId }});
        return await this.todosRepository.find({ where: { id, author: { id: userId }}, withDeleted: true, });
    }
}
