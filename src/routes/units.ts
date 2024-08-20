import express from 'express';
import UnitsController from '../controllers/units.controller';
const router = express.Router();

const useRouteUnits = () => {
    router.get('/', UnitsController.getUnits);
    
    return router;
}

export default useRouteUnits;