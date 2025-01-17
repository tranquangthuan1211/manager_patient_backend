import mongoose, { Collection } from "mongoose";
import { BlogAction } from "./schemas/blog";

class BlogDataBase {
    get blog_actions(): Collection<BlogAction> {
        return mongoose.connection.collection("blog_actions");
    }
}

export default new BlogDataBase();
