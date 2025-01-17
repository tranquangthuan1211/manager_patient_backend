export interface Blog {
    id: string;
    user_id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    image?: string;
}

export interface DetailedBlog {
    id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    user_name: string;
    image?: string;
}

export interface BlogAction {
    blog_id: string;
    user_id: string;
    action: "like" | "save";
    created_at: string;
}

export const initialBlog: Blog = {
    id: "",
    user_id: "",
    title: "",
    content: "",
    created_at: "",
    updated_at: "",
    image: "",
};
