import { PartialType } from "@nestjs/mapped-types";
import { CreateTodoDto } from "./create-todo.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { TodoStatus } from "../todo.schema";

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @ApiPropertyOptional({ enum: TodoStatus })
  status?: TodoStatus;
}
