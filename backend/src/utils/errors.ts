// Erro de validaçao (ex: campos obrigatórios, formato invalido, etc)

export class ValidationError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400; // Bad Request
    }
}

// Erro para recursos não encontrados
export class NotFoundError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404; // Not Found
    }
}