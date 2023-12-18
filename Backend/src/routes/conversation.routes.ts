import express, { Router } from "express";
import {
  getAllConversations,
  newConversation,
  readConversation,
} from "../controllers/conversationsController";
import { isUser, verifyToken } from "../controllers/authController";

export const conversationsRouter: Router = express.Router();

conversationsRouter.post("/new", verifyToken, isUser, newConversation);

conversationsRouter.get("/:userId", verifyToken, isUser, getAllConversations);

conversationsRouter.put("/:conversationId/read", verifyToken, isUser, readConversation);

