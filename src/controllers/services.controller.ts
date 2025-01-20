import { Request, Response } from "express";
import ServiceDataBase from '../models/service-model'
import { verifyToken } from "../securities/jwt";
import { ObjectId } from "mongodb";

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
            console.log(token)
            const payload = await verifyToken({ tokens: token as string });
            console.log(payload)
            const service = await ServiceDataBase.services.find({id_manager:payload._id}).toArray();
            res.status(200).json({
                data: service
            });
        } catch (error:any) {
            res.status(500).json({ message: error.message });
        }
    }
    async createService(req: Request, res: Response) {
        try {
            const {_id,...service} = req.body;
            const result = await ServiceDataBase.services.insertOne(service);
            res.status(200).json(result);
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
    async updateService(req: Request, res: Response) {
        try {
            const {_id,...ressult}= req.body;
            const result = await ServiceDataBase.services.updateOne(
                { _id: new ObjectId(req.params.id) }, 
                { $set: ressult});
            res.status(200).json(result);
        } catch (error:any) {
            res.status(500).json({ message: error.message });
        }
    }

}

export default new ServiceController();