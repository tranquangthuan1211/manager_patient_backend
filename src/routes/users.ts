import express from "express";
import UserController from "../controllers/users.controllers";
import { authMiddleware } from "../middlewares/auth.middileware";
import { managerMiddleware } from "../middlewares/manger.middileware";
import uploadCloud from "../configs/cloudinary";
const router = express.Router();
const useRouteUser = () => {
    router.post("/register", uploadCloud.single("avatar"), UserController.register);
    router.post("/login", UserController.login);
    router.post("/login-google", UserController.loginGoogle);
    router.get("/", UserController.getAllUsers);
    router.put("/:id", UserController.updateUserById);
    router.use(authMiddleware);
    router.patch("/change-password", UserController.changePassword);
    router.delete("/:id", UserController.deleteUserById);
    router.get("/info", UserController.getUser);
    router.put("/", UserController.updateUser);
    router.get("/likes-blog/:blogId", UserController.likeBlog);
    router.delete("/likes-blog/:blogId", UserController.unLikeBlog);
    router.get("/save-blog/:blogId", UserController.saveBlog);
    router.delete("/save-blog/:blogId", UserController.unSaveBlog);
    router.get("/saved-blogs", UserController.getSavedBlogs);

    // router.use(adminMiddleware);
    return router;
};

export default useRouteUser;
