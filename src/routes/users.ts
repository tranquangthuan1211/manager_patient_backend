import express from 'express';
import UserController from '../controllers/users.controllers';
import {authMiddleware} from '../middlewares/auth.middileware';
import {managerMiddleware} from "../middlewares/manger.middileware"
import uploadCloud from '../configs/cloudinary';
const router = express.Router();
const useRouteUser = () => {
    router.post('/register', uploadCloud.single("avatar"),UserController.register);
    router.post('/login', UserController.login);
    router.use(authMiddleware);
    router.put("/:id", UserController.updateUserById)
    router.patch("/change-password", UserController.changePassword)
    router.delete("/:id", UserController.deleteUserById)
    router.get('/info', UserController.getUser);
    router.put('/', UserController.updateUser);
    // router.use(adminMiddleware);
    return router;
}

export default useRouteUser;