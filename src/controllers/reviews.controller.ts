import { Request,Response } from "express";
import { Review } from "../models/schemas/review";
import {getReviewHandler} from "../services/review/index";
import ReviewDataBase from "../models/review-model";
class ReviewsController {
    async getReviews(req: Request, res: Response) {
        try {
            const reviews = await getReviewHandler(req.params.id);
            res.status(200).json({
                error: 0,
                message: "success",
                data: reviews
            });
        }catch(err:any) {
            res.status(500).json({ 
                error: 1,
                message: err.message
            });
        }
    }
    async addReview(req: Request, res: Response) {
        try {
            const review = req.body 
            const result = await ReviewDataBase.clinics.insertOne(review);
            res.status(200).json({
                error: 0,
                message: "success",
                data: review
            });
        }catch(err:any) {
            res.status(500).json({ 
                error: 1,
                message: err.message
            });
        }
    }
}
export default new ReviewsController();