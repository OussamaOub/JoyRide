import { NextFunction, Request, Response } from "express";
import { User } from "../../prisma/client";
import { prisma } from "../utils/db";

interface AuthReq extends Request{
    user?: User
    body:{
        bookingId: string
    }
}

export async function isPassenger(req: AuthReq, res: Response, next: NextFunction){
    if (req?.body?.bookingId && req?.user){
        try
{  
            const ride = await prisma.bookedRides.findFirstOrThrow({
        where:
            {
                userId: req?.user?.id,
                id: req.body.bookingId
            }
    })
    if (ride)
    {

        // console.log("user is Passenger")
next()

    }
else res.status(403).json({message: "Couldn't Find Post"})
}
    catch(error){
        res.status(404).json({message: "Unexpected Error"})
    }

    }
    else{
        res.status(500).json({message: "Unexpected Error"})
    }
}