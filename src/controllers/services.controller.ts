import { Request, Response } from "express";
import ServiceDataBase from '../models/service-model'

class ServiceController {
    async getServiceById(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const service = await ServiceDataBase.services.find({id_manager:id}).toArray();
            res.status(200).json(service);
        } catch (error:any) {
            res.status(500).json({ message: error.message });
        }
    }
    async getServicesByName(req: Request, res: Response) {
        try {
            const name = req.query.name as string;
            const nameFormat = name?.toString().toLowerCase().replace(/\s+/g, '');

            const services = await ServiceDataBase.services.find({name: nameFormat}).toArray();
            res.status(200).json(services);
        } catch (error:any) {
            res.status(500).json({ message: error.message });
        }
    }

}

export default new ServiceController();