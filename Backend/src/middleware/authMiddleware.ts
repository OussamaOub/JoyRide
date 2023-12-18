// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthReq extends Request{
    user?: {
        role: string
    }
}

const SECRET_KEY = process.env.SECRET_KEY || 'yourSecretKey';

