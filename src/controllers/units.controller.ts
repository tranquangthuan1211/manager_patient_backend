import UnitsDataBase from '../models/unit-model'
import { Request,Response } from 'express'

class UnitsController {
    async getUnits(req:Request, res:Response) {
        try {
            const units = await UnitsDataBase.units.find({}).toArray()
            res.status(200).json({
                data: units
            })
        } catch (err:any) {
            res.status(500).json({ message: err.message })
        }
    }
}

export default new UnitsController()