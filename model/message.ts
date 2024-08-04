export interface Message {
    id: number | null
    senderId: string
    recipientId: string
    content: string
    createdAt: string
}

export interface MessageRequest {
    recipient: string
    content: string
}