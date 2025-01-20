import express from "express";
import rabbitMQ from "../configs/rabbit-mq";
import exp from "constants";
const router = express.Router();
const useRouteTest = () => {
    router.get("/", (req, res) => {
        res.send("Test route");
    });
    router.post('/', async(req, res) => {
        const { to, subject, body } = req.body;
        const message = { to, subject, body };
        const channel = await rabbitMQ.getChannel();
        channel.publish("emailExchange", "email.send", Buffer.from(JSON.stringify(message)));
        res.json({ message: 'Test route' });
    })
    return router;
};
export default useRouteTest;