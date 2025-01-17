import express from "express";
import BlogController from "../controllers/blog.controller";
import uploadCloud from "../configs/cloudinary";
import { createComment, getCommentsForBlog } from "../controllers/comments.controller";

const router = express.Router();

const useRouteBlog = () => {
    router.get("/", BlogController.getBlogs);
    router.post("/", uploadCloud.single("image"), BlogController.createBlog);
    router.get("/:id", BlogController.getBlog);
    router.put("/:id", uploadCloud.single("image"), BlogController.updateBlog);
    router.delete("/:id", BlogController.deleteBlog);

    router.post("/:blogId/comments", createComment);
    router.get("/:blogId/comments", getCommentsForBlog);

    return router;
};
export default useRouteBlog;
