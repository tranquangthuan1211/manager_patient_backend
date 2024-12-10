import mongoose, {Collection} from 'mongoose'
import { Favourite } from './schemas/favourite';

class FavouriteBase {
    get Favourite(): Collection<Favourite> {
        return mongoose.connection.collection('favourite')
    }
}

export default new FavouriteBase();