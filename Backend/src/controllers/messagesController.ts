import { Request, Response } from "express";
import { prisma } from "../utils/db";
import { User } from "../../prisma/client";
import { Server } from "socket.io";

interface AuthReq extends Request {
    user?: User;
    }


export const newMessage = async (req: AuthReq, res: Response, io: Server | null) => {
    if (req.user){
        const { message, conversationId } = req.body;

        if (!message || message.trim() === "")
          return res.status(400).json({ message: "Must provide a message" });
      
        if (!conversationId)
          return res.status(400).json({ message: "Must provide a conversationId" });
      
        const authorId = req.user?.id;
        const parsedAuthorId = authorId;
        const parsedConversationId = conversationId;
      
        try {
          const newMessage = await prisma.message.create({
            data: {
              message,
              authorId: parsedAuthorId,
              conversationId: parsedConversationId,
            },
            include: {
              conversation: {
                include: {
                  participants: true,
                },
              },
            },
          });
      
          io?.emit('new_message', {
            id: newMessage.id,
            message: newMessage.message,
            authorId: newMessage.authorId,
            created_at: newMessage.created_at,
        });


          // Update dateLastMessage
          const conversation = newMessage.conversation;
          if (conversation) {
            await prisma.conversation.update({
              where: { id: conversation.id },
              data: { dateLastMessage: new Date() },
            });
          }
      
          // Set all participants' isRead to false except author
          conversation?.participants
            .filter((participant) => participant.userId !== parsedAuthorId)
            .map(async (participant) => {
              await prisma.conversationUser.updateMany({
                where: {
                  conversationId: parsedConversationId,
                  userId: participant.userId,
                },
                data: { isRead: false },
              });
            });
      
          const response = {
            id: newMessage.id,
            message: newMessage.message,
            authorId: newMessage.authorId,
            created_at: newMessage.created_at,
          };
          res.status(200).json(response);
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: err });
        }
      
    }
    else{
        res.status(401).json({ message: "Unauthorized" });
    }
};

export const getMessagesInConversation = async (
  req: AuthReq,
  res: Response
) => {
  const { conversationId, page = 1, limit = 10 } = req.query;

  if (!conversationId)
    return res.status(400).json({ message: "Must provide a conversationId" });

  const currentUserId = req.user?.id;
  const parsedCurrentUserId = currentUserId as string;
  const parsedConversationId = conversationId as string;
  const parsedPage = page as string;
  const parsedLimit = limit as string;
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: parsedConversationId },
      include: { participants: true },
    });
    if (
      conversation?.participants[0].userId !== parsedCurrentUserId &&
      conversation?.participants[1].userId !== parsedCurrentUserId
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await prisma.conversationUser.updateMany({
      where: {
        conversationId: parsedConversationId,
        userId: parsedCurrentUserId,
      },
      data: { isRead: true },
    });

    let messages;
    if (page) {
      messages = await prisma.message.findMany({
        where: {
          conversationId: parsedConversationId,
        },
        orderBy: { created_at: "desc" },
        // skip: (parsedPage - 1) * parsedLimit,
        // take: parsedLimit,
      });
    } else {
      messages = await prisma.message.findMany({
        where: {
          conversationId: parsedConversationId,
        },
        orderBy: { created_at: "desc" },
      });
    }
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

export const deleteMessage = async (req: AuthReq, res: Response) => {
  const id = req.params.id;
  try {
    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (message?.authorId !== req.user?.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own messages" });
    }

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await prisma.message.delete({
      where: { id },
    });

    res
      .status(200)
      .json({ message: "Message deleted successfully", messageId: id });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const editMessage = async (req: AuthReq, res: Response) => {
  const { message: newMessageBody } = req.body;

  if (!newMessageBody || newMessageBody.trim() === "")
    return res.status(400).json({ message: "Must provide a message" });

  const id = req.params.id;
  try {
    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message?.authorId !== req.user?.id) {
      return res
        .status(403)
        .json({ message: "You can only edit your own messages" });
    }

    if (!newMessageBody || newMessageBody.trim() === "")
      return res.status(400).json({ message: "Message cannot be empty" });

    const updatedMessage = await prisma.message.update({
      where: {
        id,
      },
      data: {
        message: newMessageBody,
        isEdited: true,
      },
    });

    res.status(200).json({ updatedMessage });
  } catch (err) {
    res.status(500).json(err);
  }
};