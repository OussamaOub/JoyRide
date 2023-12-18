import { NextFunction, Request, Response } from "express"
import { User } from "../../prisma/client"
import { PostProps } from "../controllers/postController"

interface AuthReq extends Request{
    user?:User
    post?: PostProps
  }

export const isAuthor = async(req: AuthReq, res:Response, next: NextFunction) =>{

    if(req.post){
        if (req.post.authorId === req.user?.id){
            // console.log("Author")
            next();
        }
        else{
            res.status(440).json({message: "Not post owner"})
        }
    }
    else{
        res.status(444).json({message: "Unothorized"})
    }

}