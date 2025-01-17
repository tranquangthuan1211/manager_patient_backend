import "dotenv/config";
import mongoose, { Collection } from "mongoose";
import { Users } from "../../models/schemas/user";
import { Blog, BlogAction } from "../../models/schemas/blog";

class Database {
    constructor() {
        this.connect();
    }
    async connect() {
        try {
            const mongoUrl = process.env.MONGO_URL as string;
            if (!mongoUrl) throw new Error("Mongo URL is not defined");
            await mongoose.connect(mongoUrl, {});
            console.log("connect successfully!!!");
        } catch (error) {
            console.log("Database connection failed");
        }
    }
    get users(): Collection<Users> {
        return mongoose.connection.collection("users");
    }

    get blogs(): Collection<Blog> {
        return mongoose.connection.collection("blogs");
    }

    get blog_action(): Collection<BlogAction> {
        return mongoose.connection.collection("blog_actions");
    }
}
export default new Database();
