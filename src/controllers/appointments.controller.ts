import { Request, Response } from 'express'
import AppointmentDataBase from '../models/appointment-model'
import { verifyToken } from '../securities/jwt';
import { ObjectId } from "mongodb";
import { error } from 'console';
import {getAppointmentsHandler} from '../services/appointment/appointment-service'
class AppointmentController {
    async getAppointment(req: Request, res: Response){
        try {
            const reqHeaders = req.headers['authorization']
            console.log(reqHeaders)
            const payload = await verifyToken({ tokens: reqHeaders as string })
            // console.log(payload)
            const appointment = await getAppointmentsHandler("6762f84c51d9c7640423fe72")
            if(!appointment){
                throw new Error("Appointment not found")
            }
            return res.status(200).json({
                error: false,
                message:"success",
                data: appointment
            })
        }
        catch (err: any) {
            res.status(500).json({ message: err.message })
        }
    }
    async getAppointments(req: Request, res: Response){
        try {
            const reqHeaders = req.headers['authorization']
            const payload = await verifyToken({ tokens: reqHeaders as string })
            console.log(payload.role)
            const appointments = await getAppointmentsHandler("")
            // console.log(appointments)
            return res.status(200).json({
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
            // console.log(payload)
            const newAppointment = {...req.body, patient_id: payload._id}
            console.log(newAppointment)
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
            const id = req.params.id as string
            const {_id,...rest} = req.body
            const result = await AppointmentDataBase.appointments.updateOne({ _id: new ObjectId(id )}, {$set: rest})    
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