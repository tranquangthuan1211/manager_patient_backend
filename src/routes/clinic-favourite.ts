import express from 'express';
import FavouriteClinicController from '../controllers/clinic-favourite.controller';
const router = express.Router();
import { authMiddleware } from '../middlewares/auth.middileware';

function useRouteFavouriteClinic() {
    router.use(authMiddleware);
    router.get('/', FavouriteClinicController.getFavourites);
    router.post("/", FavouriteClinicController.addFavourite);
    router.put("/", FavouriteClinicController.updateFavourite);
    router.delete("/:id", FavouriteClinicController.deleteFavourite);
    return router;
}
export default useRouteFavouriteClinic;