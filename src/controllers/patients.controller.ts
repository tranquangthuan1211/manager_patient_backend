import { Request, Response } from "express";
import UsersDataBase from "../models/user-model";
import { verifyToken } from "../securities/jwt";
import { Users } from "../models/schemas/user";
async function getUserInfoHandler(id: string, role: string) {
    try {
        let pipeline: any[] = [];

        if (role === "manager") {
            pipeline = pipeline.concat([
                {
                    $match: { role: "patient", id_manager: id }
                },
                {
                    $lookup: {
                        from: "users",
                        let: { doctorId: "$id_doctor" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$id", "$$doctorId"] } } },
                            { $project: { name: 1, _id: 0 } }
                        ],
                        as: "doctor"
                    }
                }
            ]);
        } else if (role === "doctor") {
            pipeline = pipeline.concat([
                {
                    $match: { role: "patient", id_doctor: id }
                },
                {
                    $lookup: {
                        from: "users",
                        let: { doctorId: "$id_doctor" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$id", "$$doctorId"] } } },
                            { $project: { name: 1, _id: 0 } }
                        ],
                        as: "doctor"
                    }
                }
            ]);
        }

        // Projecting final fields
        pipeline.push({
            $project: {
                id: 1,
                patient_code: 1,
                id_doctor: 1,
                name: 1,
                age: 1,
                address: 1,
                gender: 1,
                phone: 1,
                role: 1,
                status: 1,
                consulting_day: 1,
                doctor_name: { $arrayElemAt: ["$doctor.name", 0] },
            }
        });

        // Executing the pipeline
        const data = await UsersDataBase.users.aggregate(pipeline).toArray();
        return data;
    } catch (err: any) {
        console.log(err);
        throw new Error(err);
    }
}

class PaitientController {
    async getInforPatient(req: Request, res:Response) {
        try {
            const id = req.params.id;
            const patient = await UsersDataBase.users.findOne({_id: new Object(id)});
            if(!patient){
                return res.status(404).json({
                    error: 1,
                    message: 'Patient not found',
                    data: null
                });
            }
            return res.status(200).json({
                error: 0,
                message: 'Get patient success',
                data: patient
            });
        } catch (error:any) {
            return res.status(400).json({
                error: 1,
                message: error?.message,
                data: null
            });
        }
    }
    async updatePatient(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const data = req.body;
            await UsersDataBase.users.updateOne({_id: new Object(id)}, {$set: data});
            return res.status(200).json({
                error: 0,
                message: 'Update patient success',
                data: null
            });
        } catch (error:any) {
            return res.status(400).json({
                error: 1,
                message: error?.message,
                data: null
            });
        }
    }
    async deletePatient(req: Request, res: Response) {
        try {
            const id = req.params.id;
            console.log(`xoas ${id}`);
            await UsersDataBase.users.deleteOne({id: id});
            return res.status(200).json({
                error: 0,
                message: "Delete patient success",
                data: null,
            });
        } catch (error:any) {
            return res.status(400).json({
                error: 1,
                message: error?.message,
                data: null,
            });
        }
        
    }
    async getPatients(req: Request, res: Response) {
        try{
            const headersRequest = req.headers.authorization;
            const token = await verifyToken({tokens: headersRequest as string});
            let patients:Users[] = [] 
            if(token.role === "admin") {
                patients = await UsersDataBase.users.find({role:"patient"}).toArray();
                return res.status(200).json(patients);
            }
            const data = await getUserInfoHandler(token.id, token.role);
            return res.status(200).json(data);

        }
        catch (error:any) {
            return res.status(400).json({
                error: 1,
                message: error?.message,
                data: null,
            });
        }
    }
}

export default new PaitientController();