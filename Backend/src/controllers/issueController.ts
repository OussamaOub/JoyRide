import { Request, Response } from "express";
import { userSchema } from "../models/user/usermodel";
import { User } from "../../prisma/client";
import { prisma } from "../utils/db";

interface AuthReq extends Request{
    user?:User
  }

export async function postIssue (req: Request, res: Response){
// console.log("Posting Issue")
}

export async function getIssues (req: AuthReq, res: Response){
if (req.user){
    const user = req.user
    try{
        const issues = await prisma.issue.findMany({
            where:{
                userId: user.id
            }
        })
        res.status(201).json(issues);
    }
    catch(error){
        res.status(500).json(error)
    }
}
else{
    res.status(401).json({message: "Unauthorized"})
}
}