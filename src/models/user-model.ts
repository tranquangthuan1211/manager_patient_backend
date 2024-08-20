import mongoose, {Collection} from 'mongoose'
import { Users } from './schemas/user'

class UsersDataBase {
    get users(): Collection<Users> {
        return mongoose.connection.collection('users')
    }
}

export default new UsersDataBase();