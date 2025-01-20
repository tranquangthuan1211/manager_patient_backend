import {Request, Response } from 'express'
import ComplaintDataBase from '../models/complaint-model'
import { ObjectId } from 'mongodb'
import {Complaint} from '../models/schemas/complaint'
import requestIp from 'request-ip';
import { verifyToken } from '../securities/jwt';
async function getComplaintAdmin(){
    try{
        let pipeline:any[] = []
        pipeline = pipeline.concat([
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
            },
            {
                $lookup: {
                    from: "clinic",
                    let: { managerId:{ $toObjectId: "$manager_id" } },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$managerId"] } } },
                        { $project: { name: 1, _id: 0 } }
                    ],
                    as: "manager"
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
                manager_name: { $arrayElemAt: ["$manager.name", 0] }
            }
        });
        const data = await ComplaintDataBase.complaints.aggregate(pipeline).toArray();
        return data;
     }
    catch(err:any) {
        throw new Error(err);
    }
}
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
        // const ip = requestIp.getClientIp(req);
        const headers = req.headers.authorization
        const payload = await verifyToken({ tokens:headers as string});
        console.log(payload)
        if(payload.role === 'admin') {
            const complaints = await getComplaintAdmin();
            return res.status(200).json(complaints)
        }
        // const complaints = await ComplaintDataBase.complaints.findOne({manager_id: id})
        const complaints = await getUserInfoHandler(payload._id as string)
        res.status(200).json(complaints)
    }
}

export default new ComplaintsController()