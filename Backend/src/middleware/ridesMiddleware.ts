import { NextFunction, Request, Response } from "express";
import { User } from "../../prisma/client";
import { PostProps } from "../controllers/postController";
import { prisma } from "../utils/db";

interface AuthReq extends Request{
    user?:User
    post?: PostProps
  }


export async function isFree(req: AuthReq, res: Response, next: NextFunction){
    if(req.post?.id){
        try{
            const post = await prisma.post.findFirstOrThrow({
                where:{
                    id: req.post.id
                }
            })
            const rides = await prisma.bookedRides.findMany({
                where:{
                    postId: post.id
                }
            })
            if (post.availableSeats > 0){
                next();
            }
            else{
                res.status(461).json({message: "Database error ?"})
            }
        }
        catch(error){
            res.status(500).json( {message:"Error checking if the ride is free", error})
        }
    
    }
    else{
        res.status(460).json({message: "Post not passed"})
    }
}

export async function isBooked(req: AuthReq, res: Response, next: NextFunction){
    if(req.post?.id){
        try{
            const post = await prisma.post.findFirstOrThrow({
                where:{
                    id: req.post.id
                }
            })
            const rides = await prisma.bookedRides.findFirst({
                where:{
                    postId: post.id,
                    userId: req.user?.id
                }
            })

                if (!rides)
                    next();
                else
{                res.status(261).json({message: "Already exists"})
}        }
        catch(error){
            res.status(500).json( {message:"Error checking if the ride already booked", error})
        }
    
    }
    else{
        res.status(460).json({message: "Post not passed"})
    }

}