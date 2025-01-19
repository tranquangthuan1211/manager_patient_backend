import express from 'express';
import PatientController from '../controllers/patient.controller';
const router = express.Router();

const useRoutePatient = () => {
    router.get('/',  PatientController.getPatient);
    return router;
}
export default useRoutePatient;