import express, { Router } from "express";
import { deleteMessage, editMessage, getMessagesInConversation, newMessage } from "../controllers/messagesController";
import { isUser, verifyToken } from "../controllers/authController";
import { io } from "../server";

export const messagesRouter: Router = express.Router();

messagesRouter.post("/new", verifyToken, isUser, (req, res) => newMessage(req, res, io));
messagesRouter.get("/", verifyToken, isUser, getMessagesInConversation)
messagesRouter.route("/:id")
  .delete(verifyToken, deleteMessage)
  .put(verifyToken, editMessage)

