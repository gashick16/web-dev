import { PartialType } from "@nestjs/mapped-types";
import { TodoStatus } from "../todo.entity";
import { CreateTodoDto } from "./create-todo.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @ApiPropertyOptional({ enum: TodoStatus })
  status?: TodoStatus;
}
