import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/user.entity";

export class CreateTodoDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  author: Partial<User>;
}
