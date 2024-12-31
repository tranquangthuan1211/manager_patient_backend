import "dotenv/config";
import { Request, Response } from 'express';
import express, { NextFunction } from 'express';
import Database from './configs/db';
import useRouteUser from './routes/users';
import useRouteFavourite from './routes/favourite';
import useRouteRelative from './routes/relatives';
import useRouteAppointment from './routes/appointment';
import useRouteDoctor from './routes/doctors';
import useRouteBlog from './routes/blog';
import useRouteHistorySearch from './routes/history-search';
import useClinicRoute from './routes/clinic';
import swaggerJSDoc from 'swagger-jsdoc';
import SwaggerOption from "./configs/swagger";
import swaggerUi from 'swagger-ui-express';
import morgan from "morgan";
import cors from 'cors';
import path from "path";
// import { rateLimit } from 'express-rate-limit'
const app = express();
const port = process.env.PORT || 3001;
const swaggerDocument = swaggerJSDoc(SwaggerOption);
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
Database.connect();
// const limiter = rateLimit({
// 	windowMs: 2 * 60 * 1000,
// 	limit: 3, 
//   message: "Too many requests from this IP, please try again after an hour",
// })
// app.use("/api/", limiter);
// app.all("/api/*",(req:Request,res:Response,next:NextFunction) => {
//   res.status(404).json({
//     error: "Not Found",
//     message: "The requested URL was not found on this server"
//   })
// })
const routesDef = [
  {path:"users", route: useRouteUser()},
  {path:"doctors", route: useRouteDoctor()},
  {path:"favourites", route: useRouteFavourite()},
  {path:"relatives", route: useRouteRelative()},
  {path:"appointments", route: useRouteAppointment()},
  {path:"blogs", route: useRouteBlog()},
  {path:"history-search", route: useRouteHistorySearch()},
  {path:"clinics", route: useClinicRoute()},
]
app.use("/api-docs", swaggerUi.serve as any, swaggerUi.setup(swaggerDocument) as any);
routesDef.forEach(({path,route}) => {
  app.use(`/api/v1/${path}`,route)
})
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Not found") as any;
  error.status = 404;
  next(error);
});
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 500).send({
      error: {
          status: error.status || 500,
          message: error.message || 'Internal Server Error',
      },
  });
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});