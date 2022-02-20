import { LastMessage, Message } from "./message";

interface UserChat {
    id: string,
    nickname: string
}

export interface Chat {
    id: string,
    user1: UserChat,
    user2: UserChat,
    lastMessage: LastMessage
}

export interface CompleteChat {
    id: string,
    user1: {id: string, nickname: string},
    user2: {id: string, nickname: string},
    messages: Message[]
}