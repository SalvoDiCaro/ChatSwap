export interface Message {
    id: string,
    chatId: string,
    creatorId: string,
    receiverId: string,
    text: string,
    state: string,
    dateTime: Date,
    language: string,
    textTranslated?: string,
    translated?: boolean
}

export type LastMessage = Pick<Message, 'text' | 'language' | 'creatorId'> 


