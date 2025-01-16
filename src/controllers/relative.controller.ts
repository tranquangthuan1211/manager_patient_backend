import RelativeDataBase from '../models/relative-model';
import e, { Request, Response } from 'express';
import { Relative } from '../models/schemas/relative';
import {getRelativeHandler} from '../services/relative/index'
import { verifyToken } from '../securities/jwt';
import { ObjectId } from "mongodb";

class RelativeController {
    async create(req: Request, res: Response) {
        const relative = req.body as Relative;
        try {
            await RelativeDataBase.relatives.insertOne(relative);
            res.status(201).json({
                error: 0,
                message: "success",
                data: relative
            });
        } catch (error) {
            res.status(500).json({
                error: 1,
                message: error
            });
        }
    }

    async getRelatives(req: Request, res: Response) {
        try {
            const reqHeaders = req.headers['authorization']
            const payload = await verifyToken({ tokens: reqHeaders as string })
            const relatives = await getRelativeHandler(payload._id);
            res.status(200).json({
                error: false,
                message:"success",
                data: relatives
            })
        } catch (error) {
            return res.status(500).json({
                error: true,
                message: error
            })
        }
    }
    async updateRelative(req: Request, res: Response) {
        try {
            const {_id,...rest} = req.body
            console.log(req.body)
            const result = await RelativeDataBase.relatives.updateOne({ _id: new ObjectId(req.params.id as string) }, { $set: rest });
            res.status(200).json({
                error: false,
                message: "success",
                data: result
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }
    async deleteRelative(req: Request, res: Response) {
        const id = req.params.id as string;
        try {
            await RelativeDataBase.relatives.deleteOne({ _id: new ObjectId(id) });
            res.status(200).json({
                error: false,
                message: "success"
            });
        } catch (error) {
            res.status(500).json({
                error: true,
                message: error
            });
        }
    }
}

export default new RelativeController();