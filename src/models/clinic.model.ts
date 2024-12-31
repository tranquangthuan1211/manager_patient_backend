import mongoose, {Collection} from 'mongoose'
import { Clinic } from './schemas/clinic';

class ClinicDataBase {
    get clinic(): Collection<Clinic> {
        return mongoose.connection.collection('clinic')
    }
}

export default new ClinicDataBase();