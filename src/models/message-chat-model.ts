import mongoose, {Collection} from 'mongoose'
import { MessageChat} from './schemas/message-chat'

class MessageChatBase {
    get Message(): Collection< MessageChat> {
        return mongoose.connection.collection('message-chat')
    }
}

export default new MessageChatBase();