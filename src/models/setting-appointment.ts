import mongoose, {Collection} from 'mongoose' 
import { SettingAppoitment } from './schemas/setting-appoitment'

class SettingAppoitmentDataBase {
    get settingAppoitment(): Collection<SettingAppoitment> {
        return mongoose.connection.collection('settingAppoitment')
    }
}

export default new SettingAppoitmentDataBase()