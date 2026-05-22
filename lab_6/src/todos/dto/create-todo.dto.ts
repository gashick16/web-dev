import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/user.schema";

export class CreateTodoDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  author: Partial<User>;
  'author.id': string
}
