import express from 'express';
import ServiceController from '../controllers/services.controller'

const router = express.Router();

function useServiceRouter() {
    router.get('/:id', ServiceController.getServiceById);
    router.get('/', ServiceController.getServicesByName);
    return router;
}

export default useServiceRouter;