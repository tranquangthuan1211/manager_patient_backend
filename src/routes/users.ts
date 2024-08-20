import express from 'express';
import UserController from '../controllers/users.controllers';
import {authMiddleware} from '../middlewares/auth.middileware';
import {managerMiddleware} from "../middlewares/manger.middileware"
const router = express.Router();
const useRouteUser = () => {
    router.post('/signup', UserController.createUser);
    router.post('/login', UserController.signIn);
    // router.use(adminMiddleware);
    router.get('/info', UserController.getUser);
    router.get('/', UserController.getUserInfoHandler);
    router.post("/many", UserController.createManyUsers)
    return router;
}

export default useRouteUser;