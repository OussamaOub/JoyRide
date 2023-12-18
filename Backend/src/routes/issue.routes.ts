import express from 'express';
import { isUser, verifyToken } from '../controllers/authController';
import { isPassenger } from '../middleware/issuesMiddelware';
import { getIssues } from '../controllers/issueController';

export const issuerouter = express.Router();

// issuerouter.post("/issue", verifyToken, isUser, isPassenger, )

issuerouter.get("/getUserIssues", verifyToken, isUser, getIssues)