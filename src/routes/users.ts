import express from 'express';
import UserController from '../controllers/users.controllers';
import {authMiddleware} from '../middlewares/auth.middileware';
import {managerMiddleware} from "../middlewares/manger.middileware"
const router = express.Router();
const useRouteUser = () => {
    router.post('/', UserController.createUser);
    router.post('/login', UserController.signIn);
    router.use(managerMiddleware);
    router.get('/', UserController.getUserInfoHandler);
    router.post("/many", UserController.createManyUsers)
    router.put("/:id", UserController.updateUserById)
    router.delete("/:id", UserController.deleteUserById)
    router.use(authMiddleware);
    router.get('/info', UserController.getUser);
    router.put('/', UserController.updateUser);
    // router.use(adminMiddleware);
    return router;
}

export default useRouteUser;