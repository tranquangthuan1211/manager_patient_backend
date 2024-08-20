import mongoose, {Collection} from 'mongoose'
import { Appointment } from './schemas/appointment'

class AppointmentDataBase {
    get appointments(): Collection<Appointment> {
        return mongoose.connection.collection('appointments')
    }
}

export default new AppointmentDataBase();