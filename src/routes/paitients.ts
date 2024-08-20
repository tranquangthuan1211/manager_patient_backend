import express from 'express';
import PatientController from '../controllers/patients.controller';
import {managerMiddleware} from '../middlewares/manger.middileware';

const router = express.Router();

const useRoutePatient = () => {
    // router.use(adminMiddleware);
    router.get('/', PatientController.getPatients);
    // router.use(managerMiddleware)
    router.delete("/:id", PatientController.deletePatient)
    return router;
}
export default useRoutePatient;