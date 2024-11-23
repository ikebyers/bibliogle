import { Request } from 'express';

export interface UserPayload {
    _id: string;
    username: string;
    email: string;
}

export interface GraphQLContext {
    req: Request;
    user?: UserPayload | null;
}