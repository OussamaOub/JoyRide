import { Request, Response } from "express";
import { prisma } from "../utils/db";
import { User } from "../../prisma/client";

interface AuthReq extends Request {
    user?: User;
    }

export const newConversation = async (req: AuthReq, res: Response) => {
    if (req.user){
        const participantIds: string[] = req.body.participants;

        if (!participantIds || participantIds.length === 0)
          res.status(400).json({ message: "Must provide array of participants" });
      
        const creatorId = req.user?.id;
        const creatorIdParsed = creatorId;
      
        const participants = [`${creatorIdParsed}`, `${participantIds}`];
        const conversationWithSelf =
          participantIds.length === 1 && participantIds[0] === creatorIdParsed;
      
        try {
          // Conditionally write query
          let query;
          if (conversationWithSelf) {
            query = {
              participants: {
                every: {
                  userId: { in: participants },
                },
              },
            };
          } else {
            query = {
              AND: participants.map((participantId) => ({
                participants: {
                  some: {
                    userId: participantId,
                  },
                },
              })),
            };
          }
          // Check if a conversation exists
          const existingConversation = await prisma.conversation.findMany({
            where: query,
            select: {
              id: true,
              title: true,
              participants: {
                select: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      // pfp: true,
                    },
                  },
                },
              },
            },
          });
          if (existingConversation.length > 0) {
            const response = {
              ...existingConversation[0],
              messages: undefined,
              participants: existingConversation[0].participants.map(
                (participant) => participant.user
              ),
            };
            return res.status(200).json(response);
          }
          // New conversation data
          let data;
          if (conversationWithSelf) {
            data = [{ user: { connect: { id: creatorIdParsed } } }];
          } else {
            data = participants.map((participantId) => ({
              user: { connect: { id: participantId } },
            }));
          }
          // Create new conversation
          // const conversation = await prisma.conversation.create({
          //   data:{
          //     participants:{
          //       createMany:{
          //         data: {userId: creatorIdParsed},

          //       }
          //     }
          //   }
          // });
          const conversation = await prisma.conversation.create({
            data: {
              participants: {
                create: data,
              },
            },
            select: {
              id: true,
              title: true,
              participants: {
                select: {
                  user: {
                    select: {
                      id: true,
                      // display_name: true,
                      username: true,
                      // profile_picture: true,
                    },
                  },
                },
              },
            },
          });
          const response = {
            ...conversation,
            messages: undefined,
            participants: conversation.participants.map(
              (participant) => participant.user
            ),
          };
          res.status(201).json(response);
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: err });
        }
      
    }
    else{
        // console.log("new conversation error")
        res.status(401).json({ message: "Unauthorized" });
    }
};

export const getAllConversations = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const userIdParsed = userId;
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId: userIdParsed },
        },
        // messages: {
        //   some: {},
        // },
      },
      select: {
        id: true,
        title: true,
        messages: {
          select: {
            id: true,
            message: true,
            created_at: true,
          },
          orderBy: {
            created_at: "desc",
          },
          take: 1,
        },
        participants: {
          select: {
            isRead: true,
            user: {
              select: {
                id: true,
                username: true,
                lastName: true,
                firstName: true,
                email: true,
              },
            },
          },
        },
        dateLastMessage: true,
      },

      orderBy: {
        dateLastMessage: "desc",
      },
    });

    const response = conversations.map((conversation) => {
      let isRead =
        conversation.participants[0].user.id === userIdParsed
          ? conversation.participants[0].isRead
          : conversation.participants[1].isRead;
      return {
        ...conversation,
        lastMessageSent: conversation.messages[0]?? null,
        messages: undefined,
        participants: conversation.participants.map(
          (participant) => participant.user
        ),
        isRead: isRead,
      };
    });
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

export const readConversation = async (req: AuthReq, res: Response) => {
  const { conversationId } = req.params;
  const parsedConversationId = conversationId;
  const userId = req.user?.id;
  const parsedUserId = userId;
  try {
    await prisma.conversationUser.updateMany({
      where: {
        conversationId: parsedConversationId,
        userId: parsedUserId,
      },
      data: {
        isRead: true,
      },
    });
    res
      .status(200)
      .json({ message: "Conversation has been read successfully" });
  } catch (err) {
    console.error(err);
  }
};