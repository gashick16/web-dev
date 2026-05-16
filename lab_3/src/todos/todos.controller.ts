import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserId } from 'src/users/user-id.decorator';
import { ApiCookieAuth, ApiCreatedResponse, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
    constructor(
        private todosService: TodosService
    ){}

    @Get()
    @ApiSecurity('AccessCookie')
    @ApiOkResponse({
        examples: {
            empty: {
                value: [],
                summary: 'Todos not found'
            },
            oneRecord: {
                value: [
                    {
                        "id": "91e8018f-c954-471f-9fe6-73b18e547bb1",
                        "title": "Купить молоко",
                        "description": "Свежее(опционально)",
                        "status": "pending",
                        "createdAt": "2026-05-10T13:54:24.313Z",
                        "updatedAt": "2026-05-10T13:54:24.313Z",
                        "deletedAt": null
                    }
                ],
                summary: 'One record'
            },
        }
    })
    findAll(@UserId() userId: string) {
        return this.todosService.findAll(userId);
    }

    @Get(":id")
    @ApiSecurity('AccessCookie')
    @ApiOkResponse({
        examples: {
            empty: {
                value: [],
                summary: 'Todos not found'
            },
            oneRecord: {
                value: {
                    "id": "91e8018f-c954-471f-9fe6-73b18e547bb1",
                    "title": "Купить молоко",
                    "description": "Свежее(опционально)",
                    "status": "pending",
                    "createdAt": "2026-05-10T13:54:24.313Z",
                    "updatedAt": "2026-05-10T13:54:24.313Z",
                    "deletedAt": null
                },
                summary: 'One record'
            },
        }
    })
    findOne(
        @Param(":id") id: string,
        @UserId() userId: string,
    ) {
        return this.todosService.findOne(id, userId);
    }

    @Post()
    @ApiSecurity('AccessCookie')
    @ApiCreatedResponse({
        example: {
            "id": "91e8018f-c954-471f-9fe6-73b18e547bb1",
            "title": "Купить молоко",
            "description": "Свежее(опционально)",
            "status": "pending",
            "createdAt": "2026-05-10T13:54:24.313Z",
            "updatedAt": "2026-05-10T13:54:24.313Z",
            "deletedAt": null
        }
    })
    create(
        @Body() createTodoDto: CreateTodoDto,
        @UserId() userId: string,
    ) {
        return this.todosService.create({
            ...createTodoDto,
            author: { id: userId }
        });
    }

    @Patch(":id")
    @ApiSecurity('AccessCookie')
    @ApiOkResponse({
        example: {
            "id": "91e8018f-c954-471f-9fe6-73b18e547bb1",
            "title": "Купить молоко",
            "description": "Свежее(опционально)",
            "status": "completed",
            "createdAt": "2026-05-10T13:54:24.313Z",
            "updatedAt": "2026-05-10T13:54:24.313Z",
            "deletedAt": null
        }
    })
    update(
        @Param("id") id: string,
        @Body() updateTodoDto: UpdateTodoDto,
        @UserId() userId: string,
    ) {
        return this.todosService.update(id, userId, updateTodoDto);
    }

    @Delete(":id")
    @ApiSecurity('AccessCookie')
    @ApiOkResponse({
        example:     {
            "id": "15030b84-953c-4061-916b-ee004aacc7cf",
            "title": "Купить молоко",
            "description": "Свежее(опционально)",
            "status": "pending",
            "createdAt": "2026-05-08T07:06:38.678Z",
            "updatedAt": "2026-05-08T07:06:55.992Z",
            "deletedAt": "2026-05-08T07:06:55.992Z"
        }
    })
    delete(
        @Param("id") id: string,
        @UserId() userId: string,
    ) {
        return this.todosService.delete(id, userId);
    }
}
