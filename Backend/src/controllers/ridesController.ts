import { Request, Response } from "express";
import { User } from "../../prisma/client";
import { prisma } from "../utils/db";
import { getmoney } from "../utils/queries";

interface AuthReq extends Request{
    user?: User
}

export async function getUserRides(req: AuthReq, res: Response){
            if (req.user?.id){
                try{
                    const user = req.user
                    const rides = await prisma.bookedRides.findMany({
                        where:{
                            userId: user.id
                        }
                    })
                    res.status(201).json(rides)
                }
                catch(error){
                    res.status(500).json({message: "Unexpected Error"})
                }
        
            }
            else{
                res.status(501).json({message: "User not passed"})
            }
    
}

export async function getUserEarnings(req: AuthReq, res: Response) {
  if (req.user?.id) {
    try {
      const userId = req.user.id;
      // Call the stored function using raw query
      const result = await prisma.$queryRaw`
          SELECT calculate_total_earnings(${userId}) as totalearnings;
      ` as { totalearnings: number }[];
      res.status(201).json(Number(result[0].totalearnings));
    } catch (error) {
      // console.log('Error', error);
      res.status(500).json({ message: 'Unexpected Error', error });
    }
  } else {
    res.status(501).json({ message: 'User not passed' });
  }
}


export async function getUserPassengers(req: AuthReq, res: Response) {
  if (req.user?.id) {
    try {
      const user = req.user;

      // Query the view using $queryRaw
      const result = await prisma.$queryRaw`SELECT * FROM user_passenger_view WHERE "userId" = ${user.id}` as { totalPassengers: number }[];
      const count = Number(result[0]?.totalPassengers) || 0;

      // console.log(count);

      res.status(201).json(count);
    } catch (error) {
      // Handle errors
      console.error('Error:', error);
      res.status(500).json({ message: 'Unexpected Error', error });
    } finally {
      // Close the Prisma client connection
      await prisma.$disconnect();
    }
  } else {
    res.status(501).json({ message: 'User not passed' });
  }
}

export async function getUserCancelledRides(req: AuthReq, res: Response) {
  if (req.user?.id) {
    try {
      const user = req.user;

      // Query the view using $queryRaw
      const result = await prisma.$queryRaw`SELECT * FROM user_cancelled_rides_view WHERE "userId" = ${user.id}` as { totalCancelledRides: number }[];
      const count = Number(result[0]?.totalCancelledRides) || 0;

      // console.log(count);

      res.status(201).json(count);
    } catch (error) {
      // Handle errors
      console.error('Error:', error);
      res.status(500).json({ message: 'Unexpected Error', error });
    } finally {
      // Close the Prisma client connection
      await prisma.$disconnect();
    }
  } else {
    res.status(501).json({ message: 'User not passed' });
  }
}

export async function getUserSpendings(req: AuthReq, res: Response) {
  if (req.user?.id) {
    try {
      const user = req.user;

      // Query the view using $queryRaw
      const result = await prisma.$queryRaw`SELECT get_user_spent_on_rides(${user.id})` as { get_user_spent_on_rides: number }[];
      const count = Number(result[0]?.get_user_spent_on_rides) || 0;
      res.status(201).json(count);
    } catch (error) {
      // Handle errors
      console.error('Error:', error);
      res.status(500).json({ message: 'Unexpected Error', error });
    } finally {
      // Close the Prisma client connection
      await prisma.$disconnect();
    }
  } else {
    res.status(501).json({ message: 'User not passed' });
  }
}

export async function getLastRideUsers(req: AuthReq, res: Response) {
  if (req.user?.id) {
    try {
      const user = req.user;
      const result = await prisma.$queryRaw`
      SELECT * FROM get_users_who_booked_same_post(${user.id})` as { totalPassengers: number }[];
      // console.log("This is the rerewfuionfuerfbiuerrfbiewun", result);
// -- SELECT DISTINCT u.*
// -- FROM "User" u
// -- JOIN "bookings" br ON u.id = br."userId"
// -- JOIN "post" p ON p.id = br."postId"
// -- JOIN "User" u_offerer ON u_offerer.id = p."authorId"
// // -- WHERE p.id IN (
// --   SELECT "postId"
// --   FROM "bookings"
// --   WHERE "userId" = ${user.id}
// -- ) AND u.id != ${user.id}
// -- UNION

// -- Second part of the query (query for the author of the post)
// -- SELECT DISTINCT u_author.*
// -- FROM "User" u_author
// -- JOIN "post" p_author ON u_author.id = p_author."authorId"
// -- WHERE p_author.id IN (
// --   SELECT "postId"
// --   FROM "bookings"
// --   WHERE "userId" = ${user.id} OR "userId" = (SELECT "authorId" FROM "post" WHERE id IN (SELECT "postId" FROM "bookings" WHERE "userId" = ${user.id}))
// -- ) OR u_author.id = ${user.id};

// --  AND u_offerer.id != ${user.id};
//       ` as { totalPassengers: number }[];
      // const count = Number(result[0]?.totalPassengers) || 0;
      // console.log("riders", result.map((r: any) => r.username));
      // console.log(count);

      res.status(201).json(result);
    } catch (error) {
      // Handle errors
      console.error('Error:', error);
      res.status(500).json({ message: 'Unexpected Error', error });
    } finally {
      // Close the Prisma client connection
      await prisma.$disconnect();
    }
  } else {
    res.status(501).json({ message: 'User not passed' });
  }
}

export const getUserFinancialData = async (req: AuthReq, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(501).json({ message: 'User not passed' });
    }

    const userPosts = await prisma.post.findMany({
      where: {
        OR: [
          { authorId: req.user.id },
          { bookedRides: { some: { userId: req.user.id } } },
        ],
      },
      select: {
        createdAt: true,
        price: true,
        authorId: true,
        bookedRides:{
          select:{
            userId: true
          }
        }
      },
    });

    // console.log(userPosts);

    interface AggregatedData {
      [formattedDate: string]: {
        day: string;
        earnings: number;
        spendings: number;
      };
    }

    const aggregatedData: AggregatedData = userPosts.reduce((result, post) => {
      const formattedDate = new Date(post.createdAt).toLocaleDateString();

      if (!result[formattedDate]) {
        result[formattedDate] = {
          day: formattedDate,
          earnings: 0,
          spendings: 0,
        };
      }

      if (post.authorId === req.user?.id) {
        result[formattedDate].earnings += post.price*post.bookedRides.length;
        
      } else {
        result[formattedDate].spendings += post.price;
      }

      return result;
    }, {} as AggregatedData);

    const formattedData = Object.values(aggregatedData);

    // console.log(formattedData);

    res.status(200).json({
      data: formattedData,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Unexpected Error', error });
  }
};
