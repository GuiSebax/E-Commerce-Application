import { Address } from "./address";

export type UserRole = "ADMIN" | "CUSTOMER";

export interface User {
    id: number;
    email: string;
    name?: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
    addresses?: Address[];
}
