import { Request, Response } from 'express'
import AppointmentDataBase from '../models/appointment-model'
import { verifyToken } from '../securities/jwt';

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
                    patient_id: 1,
                    doctor_id: 1,
                    manager_id: 1,
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
            res.status(200).json({
                data: appointments
            })
        } catch (err: any) {
            res.status(500).json({ message: err.message })
        }
    }
}

export default new AppointmentController()