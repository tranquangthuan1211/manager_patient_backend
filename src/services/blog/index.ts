import BlogDataBase from "../../models/blog-model";
import { Blog } from "../../models/schemas/blog";
export async function getBlogHandlers(currentUserId: string) {
    try {
        console.log(">>> currentUserId", currentUserId);

        let pipeline: any[] = [
            {
                $lookup: {
                    from: "users",
                    let: { userId: { $toObjectId: "$user_id" } },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                        { $project: { name: 1, _id: 1, image: 1, role: 1 } },
                    ],
                    as: "user",
                },
            },
            {
                $lookup: {
                    from: "blog_actions",
                    let: { blogId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: [{ $toObjectId: "$blog_id" }, "$$blogId"] } } },
                        { $match: { action: "like" } },
                    ],
                    as: "likes",
                },
            },
            {
                $lookup: {
                    from: "blog_actions",
                    let: { blogId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: [{ $toObjectId: "$blog_id" }, "$$blogId"] } } },
                        { $match: { action: "save" } },
                    ],
                    as: "saves",
                },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    content: 1,
                    image: 1,
                    created_at: 1,
                    user_id: { $arrayElemAt: ["$user._id", 0] },
                    author_name: { $arrayElemAt: ["$user.name", 0] },
                    author_image: { $arrayElemAt: ["$user.image", 0] },
                    author_role: { $arrayElemAt: ["$user.role", 0] },
                    like_count: { $size: "$likes" },
                    saved_count: { $size: "$saves" },
                    liked_by_current_user: { $in: [currentUserId, "$likes.user_id"] },
                    saved_by_current_user: { $in: [currentUserId, "$saves.user_id"] },
                },
            },
        ];

        const data = (await BlogDataBase.blogs.aggregate(pipeline).toArray()).map((blog: any) => {
            return {
                ...blog,
                author_role: blog.author_role.toLowerCase(),
            };
        });

        console.log(data);

        return data;
    } catch (err: any) {
        // Log chi tiết lỗi và pipeline để dễ dàng debug
        console.error("Error in getAppointmentsHandler:", err);
        throw new Error(`Failed to fetch appointments: ${err.message}`);
    }
}

export async function getBlogHandler(id: string) {
    try {
        console.log(id);
        let pipeline: any[] = [
            {
                $match: {
                    user_id: id,
                },
            },
            {
                $lookup: {
                    from: "users",
                    let: { userId: { $toObjectId: "$user_id" } },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                        { $project: { name: 1, _id: 0, image: 1, role: 1 } },
                    ],
                    as: "user",
                },
            },
            {
                $lookup: {
                    from: "blog_actions",
                    let: { blogId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: [{ $toObjectId: "$blog_id" }, "$$blogId"] } } },
                        { $match: { action: "like" } },
                    ],
                    as: "likes",
                },
            },
            {
                $lookup: {
                    from: "blog_actions",
                    let: { blogId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: [{ $toObjectId: "$blog_id" }, "$$blogId"] } } },
                        { $match: { action: "save" } },
                    ],
                    as: "saves",
                },
            },
            {
                $project: {
                    _id: 1, // Bao gồm trường _id
                    title: 1, // Bao gồm trường name
                    content: 1,
                    image: 1,
                    created_at: 1,
                    author_name: { $arrayElemAt: ["$user.name", 0] },
                    author_image: { $arrayElemAt: ["$user.image", 0] },
                    author_role: { $arrayElemAt: ["$user.role", 0] },
                    like_count: { $size: "$likes" },
                    saved_count: { $size: "$saves" },
                    liked_by_current_user: { $in: [id, "$likes.user_id"] },
                    saved_by_current_user: { $in: [id, "$saves.user_id"] },
                },
            },
        ];

        const data = (await BlogDataBase.blogs.aggregate(pipeline).toArray()).map((blog: any) => {
            return {
                ...blog,
                author_role: blog.author_role.toLowerCase(),
            };
        });

        return data;
    } catch (err: any) {
        // Log chi tiết lỗi và pipeline để dễ dàng debug
        console.error("Error in getAppointmentsHandler:", err);
        throw new Error(`Failed to fetch appointments: ${err.message}`);
    }
}
