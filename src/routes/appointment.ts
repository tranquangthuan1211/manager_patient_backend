import express from 'express'
import AppointmentController from '../controllers/appointments.controller'

const router = express.Router()

function useRouteAppointment() {
    router.get('/', AppointmentController.getAppointments)
    return router
}

export default useRouteAppointment