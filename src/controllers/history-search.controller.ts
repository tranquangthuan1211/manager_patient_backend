import { Request, Response } from 'express';
import HistoryDoctorSearchDataBase from '../models/history-doctor-search-model';
import {getHistoryDoctorSearchHandler} from '../services/history-search/index'
import { error } from 'console';
import { ObjectId } from 'mongodb';

class HistorySearchController {
    async getHistorySearch(req: Request, res: Response) {
        try {
            const historySearch = await getHistoryDoctorSearchHandler("67623089e6ef024ce774b780");
            res.json({
                error:0,
                message: 'Success',
                data: historySearch
            });
        } catch (error) {
            res.status(500).json({ message: 'Error: ' + error });
        }
    }
    async createHistorySearch(req: Request, res: Response) {
        try {
            const newHistorySearch = {...req.body};
            const re = await HistoryDoctorSearchDataBase.historySearch.findOne({ _id: new ObjectId(req.body._id)});
            if(re) {
                return res.status(200).json({
                    error: 0,
                    message: 'Success',
                })
            }
            const result = await HistoryDoctorSearchDataBase.historySearch.insertOne(newHistorySearch);
            res.status(200).json({
                error: 0,
                message: 'Success',
            });
        } catch (error) {
            res.status(500).json({
                    error: 1,
                    message: 'Error: ' + error 
                }
            );
        }
    }
}

export default new HistorySearchController();