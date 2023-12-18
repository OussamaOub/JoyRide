import {z} from "zod";
import { userSchema } from "../user/usermodel";
import { bookedRidesSchema } from "../rides/ridesmodel";

export const postschema: Zod.Schema = z.object({
    // id: z.string().nullable(),
    authorId: z.string(),
    title: z.string(),
    description: z.string().min(0).max(1000),
    published: z.boolean(),
    authorName: z.string().nullable(),
    // createdAt: z.string(),
    departureLocation: z.string(),
    destinationLocation: z.string(),
    departureDateTime: z.string(),
    arrivalDateTime: z.string(),
    price: z.number(),
    contactInformation: z.string().nullable(),
    // updatedAt: z.string(),
    //status: z.string(),
    //maxSeats: z.number(),
    availableSeats: z.number().nullable(),
    //bookedSeats: z.number(),
    // author: userSchema.nullable(),
    // bookedRides: z.array(bookedRidesSchema).nullable(),
  });
  