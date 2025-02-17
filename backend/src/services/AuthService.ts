import prisma from '../db/prisma';
import { ValidationError, NotFoundError } from '../utils/errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Autenticaçção
// Registro -> Criar um usuário com senha criptografada
// Login -> Verificar credenciais e gerar um token JWT
// Validar Token -> Decodificar o token e validar o JWT

// Configurações do token
const JWT_SECRET = process.env.JWT_SECRET || 'default';
const JWT_EXPIRES_IN = "1d";

// Registro de usuário (com hash da senha)
export async function registerUser(email: string, password: string, name?: string, role: string = "CUSTOMER") {

    if (!email || !password) {
        throw new ValidationError("Email e senha são obrigatórios");
    }

    // Verificar se o email já está cadastrado  
    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (existingUser) {
        throw new ValidationError("Email já cadastrado");
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const data = await prisma.user.create({
        data: {
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            name: name?.trim() || null,
            role: role === "ADMIN" ? "ADMIN" : "CUSTOMER"
        },
        select: {
            id: true, email: true, name: true, role: true
        }
    });

    // Gerar o token JWT
    const token = generateToken(data.id);

    return {
        user: {
            id: data.id, email: data.email,
            name: data.name, role: data.role
        }, token
    };
}


// Login de usuário 
export async function loginUser(email: string, password: string) {

    if (!email || !password) {
        throw new ValidationError("Email e senha são obrigatórios");
    }

    // Busca usuário pelo email
    const data = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!data) {
        throw new NotFoundError("Usuário não encontrado");
    }

    // Verificar a senha
    const isPasswordValid = await bcrypt.compare(password, data.password);

    if (!isPasswordValid) {
        throw new ValidationError("Senha inválida");
    }

    // Gerar o token JWT
    const token = generateToken(data.id);
    return {
        user: {
            id: data.id, email: data.email,
            name: data.name, role: data.role
        }, token
    };
}


// Gerar token JWT
function generateToken(userId: number) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Validar token JWT
export function verifyToken(token: string) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        return decoded;
    } catch (error) {
        throw new ValidationError("Token inválido");
    }

}