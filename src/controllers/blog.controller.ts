import { Request, Response } from "express";
import BlogDataBase from "../models/blog-model";
import { error } from "console";
import { ObjectId } from "mongodb";
import { Blog } from "../models/schemas/blog";
import { getBlogHandler, getBlogHandlers } from "../services/blog/index";

class BlogController {
    async getBlogs(req: Request, res: Response) {
        try {
            const currentUserId = req.query.currentUserId as string;

            const blogs = await getBlogHandlers(currentUserId);
            res.status(200).json({
                error: false,
                message: "success",
                blogs: blogs,
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
    async getBlog(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const blog = await getBlogHandler(id);
            if (blog) {
                res.status(200).json({
                    error: false,
                    message: "success",
                    blogs: blog,
                });
            } else {
                res.status(404).json({
                    error: true,
                    message: "Blog not found",
                });
            }
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
    async createBlog(req: Request, res: Response) {
        try {
            if (!req.file) {
                console.log("ko có file");
                return res.status(400).json({ error: "No file uploaded" });
            }
            const fileData = req.file;
            req.body.image = fileData?.path;
            const blog = req.body as Blog;
            const result = await BlogDataBase.blogs.insertOne(blog);

            res.status(201).json({
                error: false,
                message: "Blog created successfully",
                blog: req.body,
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
    async updateBlog(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const { _id, ...rest } = req.body;

            let fileData: any = null;
            if (req.file) {
                fileData = req.file;
                rest.image = fileData?.path || "";
            }

            const result = await BlogDataBase.blogs.updateOne(
                { _id: new ObjectId(id) },
                { $set: rest }
            );

            console.log(">>> result", result);
            if (+result.modifiedCount) {
                return res.status(200).json({
                    error: false,
                    message: "Blog updated successfully",
                });
            } else if (+result.matchedCount === 0) {
                return res.status(404).json({
                    error: true,
                    message: "Blog not found",
                });
            } else {
                return res.status(500).json({
                    error: true,
                    message: "Blog not updated",
                });
            }
        } catch (error: any) {
            return res.status(500).json({
                error: true,
                message: error.message,
            });
        }
    }
    async deleteBlog(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const result = await BlogDataBase.blogs.deleteOne({ _id: new ObjectId(id) });
            if (result.deletedCount) {
                return res.status(200).json({
                    error: false,
                    message: "Blog deleted successfully",
                });
            } else {
                return res.status(404).json({
                    error: true,
                    message: "Blog not found",
                });
            }
        } catch (error: any) {
            return res.status(500).json({
                error: true,
                message: error.message,
            });
        }
    }
}

export default new BlogController();
