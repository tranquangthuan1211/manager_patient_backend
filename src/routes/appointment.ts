import express from 'express'
import AppointmentController from '../controllers/appointments.controller'

const router = express.Router()

function useRouteAppointment() {
    router.get('/', AppointmentController.getAppointments)
    router.post('/', AppointmentController.createAppointment)
    router.patch('/:id', AppointmentController.completeAppointment)
    router.put('/:id', AppointmentController.updateAppointment)
    router.delete('/:id', AppointmentController.deleteAppointment)
    return router
}

export default useRouteAppointment