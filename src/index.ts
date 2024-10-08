import "dotenv/config";
import express from 'express';
import Database from './configs/db';
import useRouteUser from './routes/users';
import useRoutePatient from './routes/paitients';
import useRouteDoctor from "./routes/doctors";
import useRouteUnits from "./routes/units";
import useRouteAppointment from "./routes/appointment";
import useRouteDisease from "./routes/diseases";
import useRouteComplaint from "./routes/complaints";
import useServiceRouter from "./routes/services";
import UseSettingAppoitmentRoutes from './routes/setting-appoitments';
import swaggerJSDoc from 'swagger-jsdoc';
import SwaggerOption from "./configs/swagger";
import swaggerUi from 'swagger-ui-express';
import morgan from "morgan";
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
const app = express();
const httpServer = http.createServer(app);
const port = process.env.PORT || 3000;
const apiRoute = express.Router();
const swaggerDocument = swaggerJSDoc(SwaggerOption);
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
Database.connect();
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000', // Địa chỉ client của bạn
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});
io.on('connection', (socket: Socket) => {
  console.log(`Một người dùng đã kết nối:  ${socket.id}`);

  socket.on('chat message', (msg: string) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Một người dùng đã ngắt kết nối');
  });
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/users', useRouteUser());
app.use('/patients', useRoutePatient());
app.use('/doctors', useRouteDoctor());
app.use('/units', useRouteUnits());
app.use('/appointments', useRouteAppointment());
app.use('/diseases', useRouteDisease());
app.use('/complaints', useRouteComplaint());
app.use('/services', useServiceRouter());
app.use("/setting-appointment", UseSettingAppoitmentRoutes());
app.use("/api/v1", apiRoute);
httpServer.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});