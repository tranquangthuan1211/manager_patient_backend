import { Request, Response } from "express";
import UsersDataBase from "../models/user-model";
import { ObjectId } from "mongodb";
import { verifyToken } from "../securities/jwt";
import { Users } from "../models/schemas/user";

async function getDoctorInfoHandler(id: string) {

}
class DoctorController {
  async getDoctor(req: Request, res: Response) {
    try{
      const id = req.params.id;
      console.log(id);
      const doctors = await UsersDataBase.users.findOne({ _id: new ObjectId(id) });
      res.json(doctors);
    }
    catch (error:any) {
      return res.status(400).json({
        error: 1,
        message: error?.message,
        data: null,
      });
    }
  }
  async deleteDoctor(req: Request, res: Response) {
    try{
      const id = req.params.id;
      const result = await UsersDataBase.users.deleteOne({ _id: new ObjectId(id) });
      res.json(result);
    }
    catch (error:any) {
      return res.status(400).json({
        error: 1,
        message: error?.message,
        data: null,
      });
    }
  }
  async getDoctors(req: Request, res: Response) {
    try{
        const headersRequest = req.headers.authorization;
        const token = await verifyToken({tokens: headersRequest as string});
        // console.log((token.role));
        let patients:Users[] = [] 
        if(token.role === "admin") {
            patients = await UsersDataBase.users.find({role:"doctor"}).toArray();
            return res.status(200).json(patients);
        }
        const data = await UsersDataBase.users.find({role:"doctor",id_manager:token.id }).toArray();
        return res.status(200).json(data);

    }
    catch (error:any) {
        return res.status(400).json({
            error: 1,
            message: error?.message,
            data: null,
        });
    }
  }
  async updateDoctor(req: Request, res: Response) {
    try{
      const id = req.params.id;
      console.log(id)
      const {_id,...rest} = req.body;
      const result = await UsersDataBase.users.updateOne({ _id: new ObjectId(id) }, { $set: rest });
      res.status(200).json(result);
    }
    catch (error:any) {
      return res.status(400).json({
        error: 1,
        message: error?.message,
        data: null,
      });
    }
  }
}

export default new DoctorController();