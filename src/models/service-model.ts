import mongoose, {Collection} from 'mongoose'
import {Service} from './schemas/service'

class ServiceDataBase {
    get services(): Collection<Service> {
        return mongoose.connection.collection('services')
    }
}

export default new ServiceDataBase();