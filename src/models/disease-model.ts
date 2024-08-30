import mongoose, {Collection} from 'mongoose'
import { Diseases } from './schemas/disease'

class DiseasesBaseData {
    get diseases(): Collection<Diseases> {
        return mongoose.connection.collection('diseases')
    }
}

export default new DiseasesBaseData();