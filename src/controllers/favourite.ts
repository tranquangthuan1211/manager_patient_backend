import {Request, Response} from 'express';
import FavouriteBase from '../models/favourite-model';
import { Favourite,initialFavourite } from '../models/schemas/favourite';
import getFavourites from '../services/favourite';
import { checkInputError } from '../securities/check-input';
import { ObjectId } from "mongodb";
class FavouriteController {
    async getFavourites(req: Request, res: Response) {
        const favourites = await getFavourites(req.query.id as string);
        res.json({
            data: favourites,
            message: "Favourites retrieved successfully",
            error: false
        });
    }
    async addFavourite(req: Request, res: Response) {
        try {
            const {valid, errors} = checkInputError(req.body,initialFavourite);
            console.log(errors);
            if(errors.length > 0) {
                throw errors;
            }
            const favourite = await FavouriteBase.Favourite.insertOne(req.body);
            res.json({
                data: req.body,
                message: "Favourite added successfully",
                error: false
            });
        }
        catch(err) {
            res.status(400).json({
                data: null,
                message: "Favourite not added",
                error: true
            });
        }
    }
    async updateFavourite(req: Request, res: Response) {
        try {
            const {id, ...rest} = req.body;
            const favourite = await FavouriteBase.Favourite.updateOne({ _id: new ObjectId(id)}, { $set: rest });
            if(favourite.matchedCount === 0) {
                throw new Error("Favourite not found");
            }
            res.json({
                data: favourite,
                message: "Favourite updated successfully",
                error: false
            });
        }
        catch(err) {
            res.status(400).json({
                data: null,
                message: "Favourite not updated",
                error: true
            });
        }
    }
}

export default new FavouriteController();