import express from 'express';
import ReviewsController from '../controllers/reviews.controller';
const router = express.Router();

const useRouteReview = () => {
    router.get('/:id',  ReviewsController.getReviews);
    router.post('/', ReviewsController.addReview);
    
    return router;
}

export default useRouteReview;