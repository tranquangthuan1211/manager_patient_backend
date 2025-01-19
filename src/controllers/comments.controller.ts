import { Request, Response } from "express";
import { Comment, CommentAction } from "../models/schemas/comment";
import commentModel from "../models/comment-model";
import commentActionModel from "../models/comment-action-model";

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
        const { userId, content, parentCommentId } = req.body;

        const newComment = {
            blog_id: blogId,
            user_id: userId,
            content: content,
            parent_comment_id: parentCommentId || null,
            created_at: new Date().toISOString(),
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
        const { blogId, currentUserId } = req.params;

        const comments = await commentModel.comments
            .aggregate([
                {
                    $match: {
                        blog_id: blogId,
                    },
                },
                {
                    $addFields: {
                        userObjectId: {
                            $toObjectId: "$user_id",
                        },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userObjectId",
                        foreignField: "_id",
                        as: "userDetails",
                    },
                },
                {
                    $unwind: "$userDetails",
                },
                {
                    $lookup: {
                        from: "comment_actions",
                        let: { commentId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$comment_id", { $toString: "$$commentId" }] },
                                            { $eq: ["$action", "like"] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "likes",
                    },
                },
                {
                    $addFields: {
                        total_likes: { $size: "$likes" },
                        liked_by_user: {
                            $in: [currentUserId, "$likes.user_id"],
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        blog_id: 1,
                        user_id: 1,
                        content: 1,
                        created_at: 1,
                        updated_at: 1,
                        parent_comment_id: 1,
                        user_name: "$userDetails.name",
                        user_avatar: "$userDetails.image",
                        total_likes: 1,
                        liked_by_user: 1,
                    },
                },
            ])
            .toArray();

        console.log(">>> comments", comments);

        const commentTree = buildCommentTree(comments as Comment[], null);

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

export const getCommentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { commentId } = req.params;

        const comment = await commentModel.comments.findOne({ _id: commentId });

        // comment tree of the comment with the given id
        if (comment) {
            const commentTree = buildCommentTree([comment], commentId);

            res.status(200).json({
                error: false,
                message: "success",
                comment: commentTree[0],
            });
        } else {
            res.status(404).json({
                error: true,
                message: "Comment not found",
            });
            return;
        }
    } catch (error) {
        res.status(500).json({
            error: true,
            message: (error as Error).message,
        });
    }
};

export const likeComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { commentId, userId } = req.params;

        console.log(">>> commentId", commentId);
        console.log(">>> userId", userId);

        const newAction = {
            comment_id: commentId,
            user_id: userId,
            action: "like",
        } as CommentAction;

        await commentActionModel.comment_actions.insertOne(newAction);

        const totalLikes = await commentActionModel.comment_actions.countDocuments({
            comment_id: commentId,
            action: "like",
        });

        res.status(201).json({
            error: false,
            message: "Comment liked successfully",
            totalLikes: totalLikes,
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: (error as Error).message,
        });
    }
};

export const unlikeComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { commentId, userId } = req.params;

        await commentActionModel.comment_actions.deleteOne({
            comment_id: commentId,
            user_id: userId,
            action: "like",
        });

        const totalLikes = await commentActionModel.comment_actions.countDocuments({
            comment_id: commentId,
            action: "like",
        });

        res.status(200).json({
            error: false,
            message: "Comment unliked successfully",
            totalLikes: totalLikes,
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: (error as Error).message,
        });
    }
};
