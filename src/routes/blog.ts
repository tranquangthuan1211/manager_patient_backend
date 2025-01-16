import express from "express"
import BlogController from "../controllers/blog.controller"
import uploadCloud from "../configs/cloudinary"

const router = express.Router()

const useRouteBlog = () => {
    router.get('/', BlogController.getBlogs)
    router.post('/', uploadCloud.single("image"),BlogController.createBlog)
    router.get('/:id', BlogController.getBlog)
    router.put('/:id', BlogController.updateBlog)
    router.delete('/:id', BlogController.deleteBlog)
    return router;
}
export default useRouteBlog;