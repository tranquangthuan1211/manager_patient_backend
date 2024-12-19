import express from "express"
import BlogController from "../controllers/blog.controller"

const router = express.Router()

const useRouteBlog = () => {
    router.get('/', BlogController.getBlogs)
    router.post('/', BlogController.createBlog)
    router.get('/:id', BlogController.getBlog)
    router.put('/:id', BlogController.updateBlog)
    router.delete('/:id', BlogController.deleteBlog)
    return router;
}
export default useRouteBlog;