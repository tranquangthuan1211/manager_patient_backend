import express from 'express';
import HistorySearchController from '../controllers/history-search.controller';
const router = express.Router();

const useRouteHistorySearch = () => {
    router.get('/', HistorySearchController.getHistorySearch);
    router.post('/', HistorySearchController.createHistorySearch);
    return router;
}

export default useRouteHistorySearch;