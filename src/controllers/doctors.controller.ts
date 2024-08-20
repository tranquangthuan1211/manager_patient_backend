import { Request, Response } from "express";
import UsersDataBase from "../models/user-model";
import { ObjectId } from "mongodb";

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
  async getDoctors(req: Request, res: Response) {
    try{
      const idManger = req.params.id
      const doctors = await UsersDataBase.users
      .find({role:"doctor", id_manager:idManger})
      .toArray();
      if(doctors.length === 0) {
        res.status(400).json({
          result: "id admin not found",
          data: []
        })
        return;
      }
      res.status(200).json({
        result:"successfully",
        data: doctors
      });

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