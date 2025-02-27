export interface Chat {
    id: number;
    name?: string;
    type: ChatType;
    createdAt: Date;
    messages: Message[];
    lastMessage?: string; // Или Message
    participants: UserChat[];
    avatarUrl?: string;
    description?: string;
  }
  
  export interface User {
    id: number;
    fullName: string;
    avatarUrl?: string | null;
    email?: string;
    chats: UserChat[];
    messages?: Message[];
  }
  
  export interface Message {
    id: number;
    chatId: number;
    senderId: number;
    content: string;
    createdAt: Date;
    chat: Chat;
    sender: User;
    status: MessageStatus;
    attachments: Attachment[];
    replyToId?: number | null;
    replyTo?: Message | null;
    replies: Message[];
  }
  
  export interface UserChat {
    userId: number;
    chatId: number;
    joinedAt: Date;
    user: User;
    chat: Chat;
    lastViewedAt?: Date | null;
  }
  
  export interface Attachment {
    id: number;
    messageId: number;
    url: string;
    type: string;
    createdAt: Date;
    message: Message;
  }
  
  export enum ChatType {
    DIRECT = "DIRECT",
    GROUP = "GROUP",
  }
  
  export enum MessageStatus {
    SENT = "SENT",
    DELIVERED = "DELIVERED",
    READ = "READ",
  }