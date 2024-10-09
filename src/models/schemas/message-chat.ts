export interface MessageChat {
    _id: string;
    sender: string;
    receiver: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}