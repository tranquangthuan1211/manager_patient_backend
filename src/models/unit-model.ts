import mongoose, {Collection} from 'mongoose' 
import {Unit} from "./schemas/unit"

class UnitsDataBase {
    get units(): Collection<Unit> {
        return mongoose.connection.collection('units')
    }
}
export default new UnitsDataBase();