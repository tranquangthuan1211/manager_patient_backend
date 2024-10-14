import express from "express";
import MessageController from "../controllers/message.controller";
const router = express.Router();

const useRouteMessage = () => {
    router.get('/:id', MessageController.getMessages);
    return router;
}

export default useRouteMessage;