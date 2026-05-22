export class CreateUserDto {
    login: string;
    passwordHash: string | null;
}
