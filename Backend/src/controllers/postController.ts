import { Request, Response } from "express"
import { BookedRides, User } from "../../prisma/client"
import { prisma } from "../utils/db"

export type PostProps={
    id: string | undefined,
    authorId: string,
    title: string,
    description: string,
    published: boolean,
    authorName: string,
    createdAt: Date,
    departureLocation: string,
    destinationLocation: string,
    departureDateTime: string,
    arrivalDateTime: string,
    price: number,
    contactInformation: string,
    updatedAt: Date,
    status: string,
    availableSeats: number,
    author: User | null,
    bookedRides: BookedRides[] | null
}


interface AuthReq extends Request{
    user?:User
    post?: PostProps
  }


export const  addpost = async(req: AuthReq, res: Response) =>{
    if (req.post){
        const post = req.post
        try{
          // console.log(post)
            const newpost = await prisma.post.create({
                data:{
                    authorId:post.authorId,
                    title: post.title,
                    description: post.description,
                    published: post.published,
                    authorName: post.authorName,
                    departureLocation: post.departureLocation,
                    departureDateTime: new Date(post.departureDateTime),
                    arrivalDateTime: new Date(post.arrivalDateTime),
                    destinationLocation: post.destinationLocation,
                    price: post.price,
                    contactInformation: post.contactInformation,
                    status: post.status,
                    availableSeats: post.availableSeats,
                }
            })
            // console.log("Post Created Successfully")
            res.status(201).json({ message: 'Post created successfully', post: newpost });
        
        }
        catch(error){
        res.status(500).json(error)
    }
    }
    else{
        res.status(407).json({error: "Post Error"})
    }
}


export const fetchPosts = async (req: Request, res: Response) => {
    try {
      const posts = await prisma.post.findMany({
        where:{
          published: true,
          departureDateTime: {
            gte: new Date(),
          },
          status: "pending",
      
        },
        orderBy: [
          {
           createdAt: 'desc', 
          },
          {
            departureDateTime: 'asc', 
          },
          {
            availableSeats: 'asc',
          }
        ],
      });
  
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  };

export const editpost = async(req: AuthReq, res: Response) =>{
      try{
        const post = req.post
        const oldpost = await prisma.post.findFirstOrThrow({
          where:{
            id: req.post?.id
          }
        })
        // console.log("oldpost", oldpost)
        // console.log("newpost", post)

        const newpost = await prisma.post.update({
          where:{
            id: req.post?.id
          },
          data:{
            authorId: post?.authorId,
            title: post?.title,
            description: post?.description,
            published: post?.published,
            authorName: post?.authorName,
            // createdAt: post?.createdAt,
            departureLocation: post?.departureLocation,
            departureDateTime: new Date(post?.departureDateTime || oldpost.departureDateTime),
            arrivalDateTime: new Date(post?.arrivalDateTime || oldpost.arrivalDateTime),
            destinationLocation: post?.destinationLocation,
            price: post?.price,
            contactInformation: post?.contactInformation,
            // updatedAt: post?.updatedAt,
            status: post?.status,
            availableSeats: post?.availableSeats,
          }
        })
        // console.log("Post Updated Successfully")
        res.status(201).json({ message: 'Post Updated successfully', newpost });
      }
      catch(error)
      {
        res.status(500).json(error)
      }
    
    
}

export const deletepost = async(req: AuthReq, res: Response) =>{
if (req.post?.id){
  try{
    const post = await prisma.post.deleteMany({
      where:{
        id: req.post.id
      },
    })
    // console.log("Post Deleted Successfully")
    res.status(201).json({ message: 'Post Deleted successfully', postdeleted: post });
  }
  catch(error)
  {
    res.status(500).json(error)
  }

}  
else{
  // console.log("Wtf")
}
  }

  export const bookpost = async(req: AuthReq, res: Response)=>{
    if (req.post?.id && req.user?.id){
      try{
        const ride = await prisma.bookedRides.create({
          data:{
            postId: req.post.id,
            userId: req.user?.id
          }
        })
        const updatedpost = await prisma.post.update({
          where:{
            id: req.post.id
          },
          data:{
            availableSeats: {decrement: 1}
          }
        })
        res.status(201).json({message: "Booked ride successfuly"})
      }
      catch(error){
        res.status(450).json({message: "Unexpected error", error})
      }
    }
    else{
      res.status(500).json({message: "No such post or user found"})
    }
  }
  
export  const getUserPosts = async(req: AuthReq, res: Response)=>{
    if (req.user?.id){
    try{
        const user = req.user
        const posts = await prisma.post.findMany({
            where:{
                authorId: user.id,
            }
        })
        res.status(201).json(posts)
    }
    catch(error){
        res.status(500).json({message: "Unexpected Error"})
    }
  }
  else{
    res.status(500).json({message: "No such post or user found"})
  }

}

export async function getPost(req: AuthReq, res: Response){
  if (req.user?.id){
    try{
        const postId = req.params.id
        const post = await prisma.post.findFirstOrThrow({
            where:{
                id: postId,
            }
        })
        res.status(201).json(post)
    }
    catch(error){
        res.status(500).json({message: "Unexpected Error"})
    }
  }
  else{
    res.status(500).json({message: "No such post or user found"})
  }

  

}

export const markascomplete = async(req: AuthReq, res: Response)=>{
  if (req.user?.id){
    try{
        const updatedpost = await prisma.post.update({
          where:{
            id: req.post?.id
          },
          data:{
            status: "completed"
          }
        })
        // const updatedrides = await prisma.bookedRides.updateMany({
        //   where:{
        //     postId: req.post?.id
        //   },
        //   data:{
        //     status: "completed"
        //   }
        // })
        res.status(201).json({message: "Marked as completed"})
    }
    catch(error){
        res.status(500).json({message: "Unexpected Error"})
    }
  }
  else{
    res.status(500).json({message: "No such post or user found"})
  }

  

}