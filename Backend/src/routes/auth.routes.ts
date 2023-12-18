import express, { Request, Response } from 'express';
import { signup, signin, verifyToken, isUser, logout, createSession, changeuserpass, checkpassword, changeuserdata } from '../controllers/authController';
import { User } from '../../prisma/client';
import { userSchema } from '../models/user/usermodel';
import { validateUserSchema } from '../models/user/ValidateSchema';

interface AuthReq extends Request{
  user?:User
}


export const userrouter = express.Router();
userrouter.post('/signup', validateUserSchema(userSchema), signup);
userrouter.post('/signin', signin, createSession);
userrouter.get("/logout", logout);

  userrouter.get('/getuser', verifyToken, isUser, (req: AuthReq, res: Response) => {
    const user = req.user;
    res.status(202).json(user)
  });
userrouter.post('/changepassword/:newpass&:oldpass', verifyToken, isUser, checkpassword, changeuserpass)
userrouter.post("/changeuserdata", verifyToken, isUser, changeuserdata)
