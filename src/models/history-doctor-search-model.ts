import mongoose, {Collection} from 'mongoose'
import { HistoryDoctorSearch } from './schemas/history-doctor-search';


class HistoryDoctorSearchDataBase {
    get historySearch(): Collection<HistoryDoctorSearch> {
        return mongoose.connection.collection('history-search')
    }
}

export default new HistoryDoctorSearchDataBase();