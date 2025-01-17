import { Request, Response } from "express";
import UsersDataBase from "../models/user-model";
import ClinicDataBase from "../models/clinic.model";
import { ObjectId } from "mongodb";

class ClinicController {
  async getClinics(req: Request, res: Response) {
    try {
      const clinics = await ClinicDataBase.clinic.find().toArray();
      res.status(200).json({
        error: 0,
        message: "success",
        data: clinics,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getDoctors(req: Request, res: Response) {
    try {
      const doctors = await UsersDataBase.users.find({ id_clinic:req.params.id }).toArray();
      res.status(200).json({
        error: 0,
        message: "success",
        data: doctors,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  async getClinic(req: Request, res: Response) {
    try {
      const clinic = await ClinicDataBase.clinic.findOne({ _id: new ObjectId(req.params.id) });
      res.status(200).json({
        error: 0,
        message: "success",
        data: clinic,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
export default new ClinicController();