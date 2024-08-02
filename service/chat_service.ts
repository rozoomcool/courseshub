import { Chat, Message, MessageStatus, PrismaClient } from '@prisma/client';
import prisma from '../config/database'

interface CreateChatParams {
    userOneId: number
    userTwoId: number
}

interface CreateMessageParams {
    senderId: number;
    chatId: number;
    content: string;
}

interface ChangeMessageStatusParams {
    messageId: number,
    status: MessageStatus
}

class ChatService {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    async createChat(params: CreateChatParams) {
        return this.prisma.chat.create({
            data: {
                participants: {
                    connect: [params.userOneId, params.userTwoId].map((id) => ({ id }))
                }
            },
            include: {
                participants: true
            }
        });
    }

    async getChatOrCreate(params: CreateChatParams) {
        const chat = await prisma.chat.findFirst({
            where: {
                participants: {
                    every: {
                        id: {
                            in: [params.userOneId, params.userTwoId]
                        }
                    }
                }
            }
        });

        if(chat != null) {
            return chat;
        }

        return await this.createChat(params);
    }

    async findChatsByParticipants(participantId: number): Promise<Chat[] | null> {
        return await this.prisma.chat.findMany({
            where: {
                participants: {
                    some: {
                        id: participantId
                    }
                },
            },
            include: {
                participants: true,
                messages: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        })
    }

    async createMessage(params: CreateMessageParams): Promise<Message> {
        const { senderId, chatId, content } = params;
        return await this.prisma.message.create({
            data: {
                senderId,
                chatId,
                content,
            },
        });
    }

    async chageMessageStatus(params: ChangeMessageStatusParams) {
        return await this.prisma.message.update({
            where: {
                id: params.messageId
            },
            data: {
                status: params.status
            }
        })
    }

    async getMessagesForChat(chatId: number): Promise<Message[]> {
        return await this.prisma.message.findMany({
          where: { chatId },
          orderBy: { createdAt: 'desc' },
        });
    }
}

export const chatService =  new ChatService(prisma);