import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());


// Exportar app para usar no server.ts
export { app };