import express from 'express'
import AppointmentController from '../controllers/appointments.controller'
import {managerMiddleware} from '../middlewares/manger.middileware'
const router = express.Router()

function useRouteAppointment() {
    router.get('/', AppointmentController.getAppointment)
    router.post('/', AppointmentController.createAppointment)
    router.patch('/:id', AppointmentController.updateAppointment)
    router.delete('/:id', AppointmentController.deleteAppointment)
    return router
}

export default useRouteAppointment