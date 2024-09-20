import { Request, Response } from "express";
import ServiceDataBase from '../models/service-model'
import { verifyToken } from "../securities/jwt";

async function handleGetServices(name: string) {
    try {
        let pipeline: any[] = [];

        pipeline = pipeline.concat([
            {
                $match: { name: name }
            },
            {
                $lookup: {
                    from: "users",
                    let: { managerId: { $toObjectId: "$id_manager" } },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$managerId"] } } },
                        { $project: { name: 1, _id: 1, address: 1 } }
                    ],
                    as: "manager"
                }
            }
        ])
        pipeline.push({
            $project: {
                _id: 1,
                name: 1,
                createdAt:1,
                description:1,
                clinic_id: {$arrayElemAt: ["$manager._id", 0] },
                clinic_name: { $arrayElemAt: ["$manager.name", 0] },
                address: {$arrayElemAt: ["$manager.address", 0]}
            }
        });
        const data = await ServiceDataBase.services.aggregate(pipeline).toArray();
        return data;
    } catch (error:any) {
        throw new Error(error.message);
    }
}
class ServiceController {
    async getServiceClinic(req: Request, res: Response) {
        try {
            // const id = req.params.id as string;
            const token = req.headers.authorization;
            const payload = await verifyToken({ tokens: token as string });
            const service = await ServiceDataBase.services.find({id_manager:payload.id}).toArray();
            res.status(200).json(service);
        } catch (error:any) {
            res.status(500).json({ message: error.message });
        }
    }
    async getServicesByName(req: Request, res: Response) {
        try {
            const name = req.query.name as string;
            const nameFormat = name?.toString().toLowerCase().replace(/\s+/g, '');
            const services = await handleGetServices(nameFormat);
            // const services = await ServiceDataBase.services.find({name: nameFormat}).toArray();
            res.status(200).json(services);
        } catch (error:any) {
            res.status(500).json({ message: error.message });
        }
    }

}

export default new ServiceController();