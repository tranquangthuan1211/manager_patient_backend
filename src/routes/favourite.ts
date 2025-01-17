import express from 'express';
import FavouriteController from '../controllers/favourite';
const router = express.Router();
import { authMiddleware } from '../middlewares/auth.middileware';

function useRouteFavourite() {
    router.use(authMiddleware);
    router.get('/', FavouriteController.getFavourites);
    router.post("/", FavouriteController.addFavourite);
    router.put("/", FavouriteController.updateFavourite);
    router.delete("/:id", FavouriteController.deleteFavourite);
    return router;
}
export default useRouteFavourite;