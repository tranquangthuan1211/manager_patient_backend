import express from 'express';
import ClinicController from '../controllers/clinic.controller';
const router = express.Router();

const useClinicRoute = () => {
    router.get('/', ClinicController.getClinics);
    router.get('/doctor/:id', ClinicController.getDoctors);
    router.get('/:id', ClinicController.getClinic);
    return router;
}

export default useClinicRoute;