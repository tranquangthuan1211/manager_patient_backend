import express from 'express';
import ServiceController from '../controllers/services.controller'

const router = express.Router();

function useServiceRouter() {
    router.get('/clinic', ServiceController.getServiceClinic);
    router.get('/', ServiceController.getServicesByName);
    return router;
}

export default useServiceRouter;