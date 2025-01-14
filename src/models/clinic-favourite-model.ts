import mongoose, {Collection} from 'mongoose'
import { FavouriteClinic } from './schemas/clinic-favourite';

class FavouriteClinicBase {
    get FavouriteClinic(): Collection<FavouriteClinic> {
        return mongoose.connection.collection('favourite-clinic')
    }
}

export default new FavouriteClinicBase();