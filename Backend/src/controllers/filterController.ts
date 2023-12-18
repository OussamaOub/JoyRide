import { Request, Response } from "express";
import { prisma } from "../utils/db";
interface Filters {
  departureLocation: string;
  destinationLocation: string;
  availableSeats: string;
  departureDateTime: string;
}

interface AuthReq extends Request {
  filters?: Filters;
}

export const filterPosts = async (req: AuthReq, res: Response) => {
  const data = req.body;
  // console.log(data);
  const departureLocation = data.departureLocation;
  const destinationLocation = data.destinationLocation;
  const availableSeats = parseInt(data.availableSeats);
  const departureDateTime = new Date(data.departureDateTime);
  // console.log(departureDateTime);

  try {
    const posts = await prisma.$queryRaw`SELECT * FROM public.Post
WHERE  published IS TRUE AND 
"departureLocation" = ${departureLocation} AND
"destinationLocation" = ${destinationLocation} AND
"availableSeats" >= ${availableSeats} AND
DATE("departureDateTime") = DATE(${departureDateTime})
ORDER BY
"createdAt" DESC,
"departureDateTime" ASC,
"availableSeats" ASC;
`;

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to filter posts" });
  }
};
