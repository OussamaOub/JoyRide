import express from 'express';
import { isUser, verifyToken } from '../controllers/authController';
import { getLastRideUsers, getUserCancelledRides, getUserEarnings, getUserExpectedEarnings, getUserFinancialData, getUserPassengers, getUserRides, getUserSpendings } from '../controllers/ridesController';

export const ridesrouter = express.Router();

ridesrouter.get("/getUserRides", verifyToken, isUser, getUserRides)
ridesrouter.get("/getUserEarnings", verifyToken, isUser, getUserEarnings)
ridesrouter.get("/getUserPassengers", verifyToken, isUser, getUserPassengers)
ridesrouter.get("/getUserCancelledRides", verifyToken, isUser, getUserCancelledRides)
ridesrouter.get("/getUserSpendings", verifyToken, isUser, getUserSpendings)
ridesrouter.get("/getLastRideUsers", verifyToken, isUser, getLastRideUsers)
ridesrouter.get("/Financials", verifyToken, isUser, getUserFinancialData)
ridesrouter.get("/getUserExpectedEarnings", verifyToken, isUser, getUserExpectedEarnings)