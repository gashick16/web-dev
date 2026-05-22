import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { TodoSchema, Todo } from './todo.schema';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { CacheModule } from 'src/cache/cache.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]), JwtModule, UsersModule, CacheModule],
  controllers: [TodosController],
  providers: [TodosService]
})
export class TodosModule {}
