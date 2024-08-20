import express from 'express';
import DoctorController from '../controllers/doctors.controller';
const router = express.Router();

const useRouteDoctor = () => {
    router.get('/', DoctorController.getDoctors);
    router.get('/doctor-id/:id', DoctorController.getDoctor);
    return router;
}
export default useRouteDoctor;