import { UserDocument } from "../user.schema";

export class UserResponseDto {
    id: string;
    login?: string;
    sessionId: string
    createdAt: string;
    updatedAt: string;

    constructor(user: UserDocument) {
        this.id = user.id
        this.login = user.login
        this.sessionId = user.sessionId 
        // this.createdAt = user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt;
        // this.updatedAt = user.updatedAt instanceof Date ? user.updatedAt.toISOString() : user.updatedAt;
    }
}