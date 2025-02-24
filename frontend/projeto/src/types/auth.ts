import { User } from "./user";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest extends LoginRequest {
    name?: string;
    role?: "ADMIN" | "CUSTOMER";
}

export interface AuthResponse {
    user: User;
    token: string;
}
