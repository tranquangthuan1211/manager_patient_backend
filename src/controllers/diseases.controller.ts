import { Request, Response } from 'express'
import DiseasesBaseData from '../models/disease-model'
import {Diseases} from '../models/schemas/disease'

class DiseaseController {
    async getDiseases(req: Request, res: Response){
        try {
            const id = req.query.id
            // console.log(id)
            const diseases:Diseases[] = await DiseasesBaseData.diseases.find({id_patient: id}).toArray()
            res.status(200).json({
                data: diseases
            })
        }
        catch(err: any){
            res.status(500).json({
                message: err.message
            })
        }
    }
}
export default new DiseaseController()