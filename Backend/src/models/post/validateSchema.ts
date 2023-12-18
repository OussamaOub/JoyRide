// import { Post, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import {  User } from "../../../prisma/client";
// import { User } from "../../prisma/client";
// import { Post, User } from "../../prisma/client";
// import { Post, User } from "../../prisma/client";

type PostProps={
    id: string | undefined,
    authorId: string,
    title: string,
    description: string,
    published: boolean,
    authorName: string,
    departureLocation: string,
    destinationLocation: string,
    departureDateTime: Date,
    arrivalDateTime: Date,
    price: number,
    contactInformation: string,
    availableSeats: number,

}

interface AuthReq extends Request{
    user?:User
    post?: PostProps
  }
  

export function validatePostSchema(schema: Zod.Schema) {
    return (req:AuthReq, res: Response, next: NextFunction) => {
      try {
        const {title, description, published, departureLocation, destinationLocation, departureDateTime, arrivalDateTime, price, status, maxSeats, availableSeats, bookedSeats, id} = req.body
        if (req.user){
          const newpost: PostProps ={
            id: id,
            authorId: req.user.id,
            title,
            description,
            published,
            authorName: `${req.user.firstName} ${req.user.lastName}`,
            departureLocation,
            destinationLocation,
            departureDateTime,
            arrivalDateTime,
            price,
            contactInformation: req.user.email,
            availableSeats,
          }
            // console.log("Validating")
        schema.parse(newpost);

        // console.log("Validated")
          req.post = newpost
        next();
        }
        else{
          res.status(405).json({error: "User Error"})
        }
      } catch (error: any) {
        // console.log("Not validated")
        // If validation fails, send an error response
        res.status(406).json({ error });
      }
    };
  }
  