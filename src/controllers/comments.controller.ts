import { Request, Response } from "express";
import { Comment } from "../models/schemas/comment";
import commentModel from "../models/comment-model";

const buildCommentTree = (comments: Comment[], parentId: string | null): any[] => {
    return comments
        .filter((comment) => comment.parent_comment_id === parentId)
        .map((comment) => ({
            ...comment,
            replies: buildCommentTree(comments, comment._id.toString()),
        }));
};

export const createComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { blogId } = req.params;
        const { userId, userName, userAvatar, content, parentCommentId } = req.body;

        const newComment = {
            blog_id: blogId,
            user_id: userId,
            user_name: userName,
            user_avatar: userAvatar,
            content: content,
            parent_comment_id: parentCommentId || null,
        } as Comment;

        const comment = await commentModel.comments.insertOne(newComment);

        if (comment) {
            res.status(201).json({
                error: false,
                message: "Comment created successfully",
                comment: newComment,
            });
        } else {
            res.status(500).json({ message: "Failed to create comment" });
        }
    } catch (error) {
        res.status(500).json({
            error: true,
            message: (error as Error).message,
        });
    }
};

export const getCommentsForBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const { blogId } = req.params;
        const comments = await commentModel.comments.find({ blog_id: blogId }).toArray();

        console.log(">>> comments", comments);

        const commentTree = buildCommentTree(comments, null);

        res.status(200).json({
            error: false,
            message: "success",
            comments: commentTree,
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: (error as Error).message,
        });
    }
};
