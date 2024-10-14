import { Server, Socket } from 'socket.io';
import { Users } from '../models/schemas/user';
import MessageChatBase from '../models/message-chat-model'


interface Message {
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
  status: string;
}
interface UserChat {
  user: Users;
  socketId: string;
}
export class ChatSocket {
  private io: Server;
  private users: UserChat[] = []; 
  private messageQueue: Message[] = [];
  constructor(io: Server) {
    this.io = io;
    // this.initializeSocketEvents();
    this.chatPersonWithPerson();
  }
  private chatPersonWithPerson() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Một người dùng đã kết nối: ${socket.id}`);

      socket.on('register', (user: Users) => {
        this.users.push({ user, socketId: socket.id });
        console.log(`User ${user.id} đã đăng ký với socket ID: ${socket.id}`);

        this.sendQueuedMessages(user, socket);
      });
      socket.on('chat message', async (msg: any) => {
        this.handleChatMessage(msg, socket);
        await MessageChatBase.Message.insertOne(msg);
      });

      socket.on('disconnect', () => {
        console.log('Một người dùng đã ngắt kết nối');
      });
    });
  }
  
  private handleChatMessage(msg: Message, socket: Socket) {
    const recipient = this.users.find(userChat => userChat.user.id === msg.receiver);

    socket.emit('chat message', msg);

    if (recipient) {
      socket.to(recipient.socketId).emit('chat message', msg);
    } else {
      console.log(`Người dùng ${msg.receiver} không online, lưu tin nhắn.`);
      this.messageQueue.push(msg);
    }
  }
  private sendQueuedMessages(user: Users, socket: Socket) {
    const queuedMessages = this.messageQueue.filter(msg => msg.receiver === user.id)

    queuedMessages.forEach(msg => {
      socket.emit('chat message', msg);
    });

    // Xóa tin nhắn đã gửi ra khỏi hàng đợi
    this.messageQueue = this.messageQueue.filter(msg => msg.receiver !== user.id);
  }
}
