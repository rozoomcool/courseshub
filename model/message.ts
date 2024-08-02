export interface Message {
    id: number | null
    senderId: number
    recipientId: number
    content: string
    createdAt: string
}

export interface MessageRequest {
    recipientId: number
    content: string
}