import express from 'express';
import DoctorController from '../controllers/doctors.controller';
import {managerMiddleware} from '../middlewares/manger.middileware';
const router = express.Router();

const useRouteDoctor = () => {
    router.get('/', DoctorController.getDoctors);
    router.get('/:id', DoctorController.getDoctor);
    router.patch('/:id', DoctorController.updateDoctor);
    router.delete('/:id', DoctorController.deleteDoctor);
    return router;
}
export default useRouteDoctor;