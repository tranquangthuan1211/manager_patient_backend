import {Request, Response } from 'express'
import ComplaintDataBase from '../models/complaint-model'
import { ObjectId } from 'mongodb'
import {Complaint} from '../models/schemas/complaint'
import requestIp from 'request-ip';
async function getUserInfoHandler(id: string) {
    try {
        let pipeline: any[] = [];
        pipeline = pipeline.concat([
                {
                    $match: { manager_id: id }
                },
                {
                    $lookup: {
                        from: "users",
                        let: { doctorId:{ $toObjectId: "$doctor_id" } },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$doctorId"] } } },
                            { $project: { name: 1, _id: 0 } }
                        ],
                        as: "doctor"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        let: { patientId:{ $toObjectId: "$patient_id" } },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$patientId"] } } },
                            { $project: { name: 1, _id: 0 } }
                        ],
                        as: "patient"
                    }
                }
            ]);
        pipeline.push({
            $project: {
                id: 1,
                name: 1,
                createdAt:1,
                description:1,
                doctor_name: { $arrayElemAt: ["$doctor.name", 0] },
                patient_name: { $arrayElemAt: ["$patient.name", 0] },
            }
        });

        // Executing the pipeline
        const data = await ComplaintDataBase.complaints.aggregate(pipeline).toArray();
        return data;
    } catch (err: any) {
        console.log(err);
        throw new Error(err);
    }
}
class ComplaintsController {
    async getComplaints(req: Request, res: Response) {
        const id = req.query.id
        const ip = requestIp.getClientIp(req);
        console.log(ip)
        // const complaints = await ComplaintDataBase.complaints.findOne({manager_id: id})
        const complaints = await getUserInfoHandler(id as string)
        res.status(200).json(complaints)
    }
}

export default new ComplaintsController()