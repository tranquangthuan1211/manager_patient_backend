import e, { Request, Response } from "express";
import Database from "../configs/db";
import UsersDataBase from "../models/user-model";
import { decodeToken, signToken, verifyToken } from "../securities/jwt";
import { hashPassword, comparePassword } from "../securities/pass";
import { ObjectId } from "mongodb";
import { Users } from "../models/schemas/user";
import { checkInputError } from "../securities/check-input";
import { BlogAction } from "../models/schemas/blog";

class PatientController {
  async getPatient(req: Request, res: Response) {
    try {
      const patient = await UsersDataBase.users.find({role: "patient"}).toArray();
      if (!patient) {
        return res.status(404).json({
          error: "Not Found",
          message: "Patient not found",
        });
      }
      return res.status(200).json({
        error: 0,
        message: "Success",
        data: patient,
      });
    } catch (error:any) {
      return res.status(500).json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  }
}
export default new PatientController();