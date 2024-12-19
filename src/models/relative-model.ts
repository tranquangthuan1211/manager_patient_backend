import mongoose, {Collection} from 'mongoose'
import { Relative } from './schemas/relative';

class RelativeDataBase {
    get relatives(): Collection<Relative> {
        return mongoose.connection.collection('relatives')
    }
}

export default new RelativeDataBase();