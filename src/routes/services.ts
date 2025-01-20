import express from 'express';
import ServiceController from '../controllers/services.controller'

const router = express.Router();

function useServiceRouter() {
    router.get('/clinic', ServiceController.getServiceClinic);
    router.get('/', ServiceController.getServicesByName);
    router.put('/:id', ServiceController.updateService);
    router.post('/', ServiceController.createService);
    return router;
}

export default useServiceRouter;