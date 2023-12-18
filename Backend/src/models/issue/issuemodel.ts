import {z} from "zod";

export const postschema: Zod.Schema = z.object({
    title: z.string(),
    description: z.string().min(0).max(1000),
    authorId: z.string(),
    BookingId: z.string(),
  });
  