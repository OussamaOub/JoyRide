import {z} from "zod"
import { postschema } from "../post/postmodel";
import { userSchema } from "../user/usermodel";

export const bookedRidesSchema:Zod.Schema = z.object({
    postId: z.string(),
    userId: z.string(),
  });
  