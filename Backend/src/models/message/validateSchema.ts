// import { NextFunction, Request, Response } from "express";

// export const validateMessageSchema = (schema: Zod.Schema) =>{
//     return (req:Request, res: Response, next: NextFunction) => {
//         try {
//             const isvalid = schema.parseAsync(req.body)
//             if (!isvalid) {
//                 res.status(400).json({ message: 'Invalid request body' });
//             } else {
//                 next();
//             }
    
//         } catch (error: any) {
//           console.log("Not validated")
//           res.status(406).json({ error });
//         }
//       };
//   }