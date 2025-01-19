import mongoose, { Collection } from "mongoose";
import { CommentAction } from "./schemas/comment";

class CommentDataBase {
    get comment_actions(): Collection<CommentAction> {
        return mongoose.connection.collection("comment_actions");
    }
}

export default new CommentDataBase();
