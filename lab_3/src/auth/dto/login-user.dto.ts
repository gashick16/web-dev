import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
    @ApiProperty()
    login: string;
    @ApiProperty()
    password: string;
}