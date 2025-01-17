import mongoose, { Collection } from "mongoose";
import { Comment } from "./schemas/comment";

class CommentDataBase {
    get comments(): Collection<Comment> {
        return mongoose.connection.collection("comments");
    }
}

export default new CommentDataBase();
