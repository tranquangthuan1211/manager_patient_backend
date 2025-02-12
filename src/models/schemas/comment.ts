export interface Comment {
    _id: string;
    blog_id: string;
    user_id: string;
    user_name: string;
    user_avatar: string;
    content: string;
    created_at: string;
    updated_at: string;
    parent_comment_id: string | null;
}

export interface CommentAction {
    comment_id: string;
    user_id: string;
    action: "like" | "save";
    created_at: string;
}
