import {Request, Response} from 'express';
import MessageChatBase from '../models/message-chat-model'
async function getMessage(id: string) {
    try {
      let pipeline: any[] = [];
      

      pipeline = pipeline.concat([
        {
          $match: { receiver: id }
        },
        {
          $lookup: {
            from: "users",
            let: { idUser: { $toObjectId: "$sender" }},
            pipeline: [
              { $match:  { $expr: { $eq: ["$_id", "$$idUser"] } } },
              { $project: { name: 1, _id: 0 } }
            ],
            as: "user"
          }
        }
      ]);
  
      pipeline.push({
        $project: {
            id: 1,
            sender: 1,
            receiver: 1,
            content: 1,
            createdAt: 1,
            nameSender: { $arrayElemAt: ["$user.name", 0] },
        }
      });
  
      // Perform the query
      const data = await MessageChatBase.Message.aggregate(pipeline).toArray();
      
      return data;
    } catch (error) {
      console.error("Error in getMessage:", error);
      throw error;
    }
  }
  
  export interface MessageChat {
    _id: string;
    sender: string;
    receiver: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }
  

class MessageController {
    async getMessages(req: Request, res: Response) {
        try {
            const messages = await getMessage(req.params.id);
            res.json(messages);
        } catch (error:any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new MessageController();