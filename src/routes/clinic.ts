import express from 'express';
import ClinicController from '../controllers/clinic.controller';
const router = express.Router();

const useClinicRoute = () => {
    router.get('/', ClinicController.getClinics);
    router.get('/:id', ClinicController.getDoctors);
    return router;
}

export default useClinicRoute;