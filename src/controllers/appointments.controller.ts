import { Request, Response } from 'express'
import AppointmentDataBase from '../models/appointment-model'
import { verifyToken } from '../securities/jwt';
import { ObjectId } from "mongodb";

async function getAppointmentsHandler(id:string, role:string) {
    try {
            let pipeline: any[] = [];
            if(role === "doctor"){
                pipeline = pipeline.concat([{
                    $lookup: {
                    from: "users", 
                    let: { doctorId: id },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$id", "$$doctorId"] } } },
                        { $project: { name: 1, _id: 0 } }
                    ],
                    as: "doctor"
                    }
                },
                {
                    $lookup: {
                    from: "users",
                    let: { patientId: "$patient_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$id", "$$patientId"] } } },
                        { $project: { name: 1, _id: 0 } }
                    ],
                    as: "patient"
                    }
                },
                {
                    $project: {
                    _id: 1, 
                    patient_id: 1,
                    doctor_id: 1,
                    manager_id: 1,
                    date: 1,
                    time: 1,
                    patient_name: { $arrayElemAt: ["$patient.name", 0] }
                    }
                }
                ])
            }else {
                pipeline = pipeline.concat([
                {
                    $lookup: {
                        from: "users", 
                        let: { managerId: id },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$id", "$$managerId"] } } },
                            { $project: { name: 1, _id: 0 } }
                        ],
                        as: "manager"
                    }
                },
                {
                    $lookup: {
                    from: "users", 
                    let: { doctorId: "$doctor_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$id", "$$doctorId"] } } },
                        { $project: { name: 1, _id: 0 } }
                    ],
                    as: "doctor"
                    }
                },
                {
                    $lookup: {
                    from: "users",
                    let: { patientId: "$patient_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$id", "$$patientId"] } } },
                        { $project: { name: 1, _id: 0 } }
                    ],
                    as: "patient"
                    }
                },
                {
                    $project: {
                    _id: 1,
                    manager_id: 1,
                    status:1,
                    date: 1,
                    time: 1,
                    patient_name: { $arrayElemAt: ["$patient.name", 0] },
                    doctor_name: { $arrayElemAt: ["$doctor.name", 0] }
                    }
                }
                ])
            }
          const data = await AppointmentDataBase.appointments.aggregate(pipeline).toArray();
          return data;
        } catch (err: any) {
        console.error("Error in getUserInfoHandler:", err);
        throw err;
    }
}
class AppointmentController {
    async getAppointments(req: Request, res: Response){
        try {
            const reqHeaders = req.headers['authorization']
            const payload = await verifyToken({ tokens: reqHeaders as string })
            console.log(payload.role)
            const appointments = await getAppointmentsHandler(payload.id as string, payload.role as string)
            // console.log(appointments)
            res.status(200).json({
                data: appointments
            })
        } catch (err: any) {
            res.status(500).json({ message: err.message })
        }
    }
    async createAppointment(req: Request, res: Response){
        try {
            const reqHeaders = req.headers['authorization']
            const payload = await verifyToken({ tokens: reqHeaders as string })
            const newAppointment = {...req.body, patient_id: payload._id}
            // console.log(newAppointment)
            const result = await AppointmentDataBase.appointments.insertOne(newAppointment)
            res.status(200).json({
                data: result
            })
            
        } catch (err: any) {
            res.status(500).json({ message: err.message })
        }
    }
    async completeAppointment(req: Request, res: Response){
        try {
            const _id = req.params.id as string
            const {id, doctor_id, status} = req.body 
            const result = await AppointmentDataBase.appointments.updateOne({ _id: new ObjectId(_id )}, {$set: {status: status, doctor_id}})
            res.status(200).json({
                data: result
            })
        } catch (err: any) {
            res.status(500).json({ message: err.message })
        }
    }
    async updateAppointment(req: Request, res: Response){
        try {
            console.log(req.body)
            const _id = req.params.id as string
            const {id, doctor_id, status, ...rest} = req.body
            const result = await AppointmentDataBase.appointments.updateOne({ _id: new ObjectId(_id )}, {$set: {status: status, doctor_id}})    
            res.status(200).json({
                data: result
            })
        } catch (err: any) {
            res.status(500).json({ message: err.message })
        }
    }
    async deleteAppointment(req: Request, res: Response){  
        try {
            const _id = req.params.id as string
            console.log(_id)
            const result = await AppointmentDataBase.appointments.deleteOne({ _id: new ObjectId(_id) })
            res.status(200).json({
                data: result
            })
        } catch (err: any) {
            res.status(500).json({ message: err.message })
        }
    }
}

export default new AppointmentController()