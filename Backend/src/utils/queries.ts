import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "./db";

export const getOfferedRides = (id: string) => {
    return Prisma.sql`SELECT B.COUNT(*), P.price * B.COUNT(*) as earnings, U.id FROM BookedRides B 
    NATURAL JOIN User U NATURAL JOIN Post P
    WHERE (U.id = ${id} AND B.status = "Completed")`;
};

export const getCanceledRides = (id: string) => {
    return Prisma.sql`SELECT B.COUNT(*), U.id FROM BookedRides B NATURAL JOIN User U WHERE (U.id = ${id} AND B.status = "Canceled")`;
};

export const getUserRating = (id: string) => {
    return Prisma.sql`SELECT U.rating FROM User U where U.id = ${id}`;
};

export const getmoney = (id: string) => {
    return Prisma.sql`
      SELECT P.postId, P.price * COUNT(*) as earnings
      FROM BookedRides B
      JOIN Post P ON B.postId = P.postId
      WHERE (P.userId = ${id} AND B.status = "Completed")
      GROUP BY P.postId, P.price;
    `;
  }
  
// export const getIssuesReported = (id: string) => {
//     return Prisma.sql`SELECT SUM(issues), U.id FROM BookedRides`;
// }