import express from 'express';
import RelativeController from '../controllers/relative.controller';
const router = express.Router();

function useRouteRelative() {
    router.post('/', RelativeController.create);
    router.get('/', RelativeController.getRelatives);
    router.patch('/:id', RelativeController.updateRelative);
    router.delete('/:id', RelativeController.deleteRelative);
    
    return router;
}

export default useRouteRelative;