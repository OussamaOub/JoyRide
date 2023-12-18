// src/middleware/authorizationMiddleware.ts
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
    user?: {
        role: string;
    };
}

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user; // Assuming you store user role or permissions in the token

    if (user && user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Permission denied' });
    }
};
