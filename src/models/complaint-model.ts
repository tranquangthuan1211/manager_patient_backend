import mongoose, {Collection} from 'mongoose'
import { Complaint } from './schemas/complaint'

class ComplaintDataBase {
    get complaints(): Collection<Complaint> {
        return mongoose.connection.collection('complaints')
    }
}

export default new ComplaintDataBase();