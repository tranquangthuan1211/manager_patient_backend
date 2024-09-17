import express from 'express';
import SettingAppoitmentController from '../controllers/setting-appointment.controller';
const router = express.Router();

function UseSettingAppoitmentRoutes() {
    router.get('/', SettingAppoitmentController.getSettingAppoitment);
    return router;
}
export default UseSettingAppoitmentRoutes;