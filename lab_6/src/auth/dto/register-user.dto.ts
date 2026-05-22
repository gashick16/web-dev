import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserDto {
    @ApiProperty()
    login: string;
    @ApiProperty()
    password: string;
}
