import express from 'express';
import UserController from '../controllers/users.controllers';
import {authMiddleware} from '../middlewares/auth.middileware';
import {managerMiddleware} from "../middlewares/manger.middileware"
const router = express.Router();
const useRouteUser = () => {
    router.post('/', UserController.createUser);
    router.get('/info', UserController.getUser);
    router.post('/login', UserController.signIn);
    // user personality
    router.put('/', UserController.updateUser);
    // router.use(adminMiddleware);
    router.get('/', UserController.getUserInfoHandler);
    router.post("/many", UserController.createManyUsers)
    router.put("/:id", UserController.updateUserById)
    return router;
}

export default useRouteUser;