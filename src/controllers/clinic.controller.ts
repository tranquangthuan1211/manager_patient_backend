import { Request, Response } from "express";
import UsersDataBase from "../models/user-model";
import ClinicDataBase from "../models/clinic.model";

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
}
export default new ClinicController();