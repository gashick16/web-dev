import { ApiProperty } from "@nestjs/swagger";

export class CreateSessionDto {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
  @ApiProperty()
  userId: string;
  @ApiProperty({ type: "string", format: "uuid" })
  jti: string;
}
