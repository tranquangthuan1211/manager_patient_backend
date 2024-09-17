import SettingAppoitmentDataBase from '../models/setting-appointment'
import { Request, Response } from 'express'

class SettingAppoitmentController{
    async getSettingAppoitment(req: Request, res: Response){
        try {
            const idClinic = req.query.id_clinic as string
            const settingAppoitment = await SettingAppoitmentDataBase.settingAppoitment.find({id_clinic: idClinic}).toArray()
            res.status(200).send(settingAppoitment)
        } catch (error) {
            res.status(500).send(error)
        }
    }
}

export default new SettingAppoitmentController()