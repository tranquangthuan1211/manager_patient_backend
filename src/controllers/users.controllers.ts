import { Request, Response } from "express";
import Database from "../configs/db";
import UsersDataBase from "../models/user-model";
import {signToken, verifyToken} from "../securities/jwt";
import { hashPassword,comparePassword } from "../securities/pass";
import { ObjectId } from "mongodb";
import {Users} from "../models/schemas/user"
import {checkInputError} from "../securities/check-input"

async function getUserInfoHandler(role: string) {
  try {
    const userCount = await UsersDataBase.users.countDocuments({ role: role });

    if (userCount === 0) {
      return []; 
    }

    let pipeline: any[] = [
      { $match: { role: role } },
    ];
    if (role === "patient") {
      pipeline = pipeline.concat([
        {
          $lookup: {
            from: "users",
            let: { doctorId: "$id_doctor" },
            pipeline: [
              { $match: { $expr: { $eq: ["$id", "$$doctorId"] } } },
              { $project: { name: 1, _id: 0 } }
            ],
            as: "doctor"
          }
        },
        {
          $lookup: {
            from: "users",
            let: { managerId: "$id_manager" },
            pipeline: [
              { $match: { $expr: { $eq: ["$id", "$$managerId"] } } },
              { $project: { name: 1, _id: 0 } }
            ],
            as: "manager"
          }
        }
      ]);
    } else {
      pipeline.push({
        $lookup: {
          from: "users",
          let: { managerId: "$id_manager" },
          pipeline: [
            { $match: { $expr: { $eq: ["$id", "$$managerId"] } } },
            { $project: { name: 1, _id: 0 } }
          ],
          as: "manager"
        }
      });
    }
    pipeline.push({
      $project: {
        id: 1,
        patient_code: 1,
        name: 1,
        age: 1,
        address: 1,
        gender: 1,
        phone: 1,
        role: 1,
        status: 1,
        consulting_day: 1,
        doctor_name: { $arrayElemAt: ["$doctor.name", 0] },
        manager_name: { $arrayElemAt: ["$manager.name", 0] }
      }
    });

    const data = await UsersDataBase.users.aggregate(pipeline).toArray();

    // Log kết quả để debug
    // console.log(`Results for role ${role}:`, JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error("Error in getUserInfoHandler:", error);
    throw error;
  }
}
class UserController {

  async getUser(req: Request, res: Response) {
    try {
        const headerRequest = req.headers.authorization;
        const payload = await verifyToken({ tokens:headerRequest as string});
        const user = await UsersDataBase.users.findOne({ _id: new ObjectId(payload._id)});
        if(!user) {
          throw new Error("User not found");
        }
        return res.status(200).json({
          data:user
        })
        
    }
    catch (error:any) {
      return res.status(400).json({
        error: 1,
        message: error?.message,
        data: null,
      });
    }
  }
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UsersDataBase.users.find().toArray();
      return res.status(200).json({
        data: users,
      });
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tài khoản:', error);
      return res.status(500).json({
        message: 'Đã xảy ra lỗi khi lấy danh sách tài khoản',
        error: error,
      });
    }
  }
  async updateUser(req:Request, res:Response){
    try {
      if(req.headers.authorization){
        throw new Error("Invalid token")
      }
      const headerRequest = req.headers.authorization;
      const payload = await verifyToken({ tokens:headerRequest as string});
      const user = await UsersDataBase.users.findOne({ _id: new ObjectId(payload._id)});
      if(!user) {
        throw new Error("User not found");
      }
      const result = await UsersDataBase.users.updateOne({ _id: new ObjectId(payload._id)}, { $set: req.body });
      return res.status(200).json({
        message: 'Cập nhật tài khoản thành công',
        data: result,
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
  async login(req: Request, res: Response) {
    try {
      console.log(req.body)
      const user = await UsersDataBase.users.findOne({email:req.body.email});
      if(!user) {
        return res.status(400).json({message: "User not found"});
        
      }
      if(!await comparePassword(req.body.password, user.password)) {
        return res.status(401).json({message: "Password is incorrect"});
        
      }
      const {password, ...rest} = user || {};
      const token = await signToken({payload: rest});
      res.status(200).json(
        {
          result:"signin successfully",
          token: token,
          data: user
        }
      );

    }
    catch (error) {
        console.log(error);
    }
  }
  async register(req: Request, res: Response) {
    try {
      if (!req.file) {
          console.log("ko có file")
          return res.status(400).json({ error: 'No file uploaded' });
      }
      const fileData = req.file;
      req.body.image = fileData?.path;
      const newUser = req.body;
      console.log(newUser)
      newUser.password = await hashPassword(newUser.password as string);
      const user = await UsersDataBase.users.findOne({email: newUser.email});
      const {password, ...dataUser} = newUser; 
      const token = await signToken({payload: dataUser});
      if(user) {
        throw new Error("User alreadly exits");
      }
      if(newUser.role === null){
        newUser.role = "patient";
      }
      const result = await UsersDataBase.users.insertOne(newUser);
      if(!result.acknowledged) {
        throw new Error("Error when insert user");
      }
      res.status(200).json({
        error: 0,
        message: "User created successfully",
        data: token,
      });
    }
    catch (error:any) {
        return res.status(400).json({
          error: 1,
          message: error?.message,
          data: null,
        })
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const id = req.query.id as string;
      await UsersDataBase.users.deleteOne({_id: new ObjectId(id)});
      return res.json({message: "User deleted successfully"});
    }
    catch(error) {
      console.log(error);
    }
  }
  async getUserInfoHandler(req:Request, res:Response) {
    try {
      const headerRequest = req.headers.authorization;
      const payload = await verifyToken({ tokens:headerRequest as string});
      const id = payload._id;
      const role = req.query.role;
      const users: Users[] = await UsersDataBase.users.find({role:role}).toArray();
      // const data = await getUserInfoHandler(role as string);

      if(users.length === 0) {
        return res.status(400).json({
          result:"idAdmin not found!!!"
        })
      }

      return res.status(200).json({
        data:users
      })
    }
    catch(error) {
      console.log(error)
    }
  }

  async createManyUsers(req: Request, res: Response) {
    try {
      const users: Users[] = req.body.data;
      for (const user of users) {
        if (
          user.role !== "admin" && 
          user.role !== "patient" && 
          user.role !== "doctor" && 
          user.role !== "manager"
        ) {
          return res.status(400).json({
            error: "Invalid user role"
          });
        }
      }
      const formatePasswordUser: Users[] = await Promise.all(
        users.map(async (user) => {
            const passwordFormate = await hashPassword(user.password as string);
    
            return {
                ...user,
                password: passwordFormate,
            };
        })
    );    
    const createdUsers = await UsersDataBase.users.insertMany(formatePasswordUser);
      return res.status(201).json({
        message: 'Tạo nhiều tài khoản thành công',
        data: createdUsers,
      });
  
    } catch (error) {
      console.error('Lỗi khi tạo tài khoản:', error);
      return res.status(500).json({
        message: 'Đã xảy ra lỗi khi tạo tài khoản',
        error: 1,
      });
    }
  }
  async updateUserById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const user = req.body;
      const {_id, ...rest} = user;
      const result = await UsersDataBase.users.updateOne({ _id: new ObjectId(id)}, { $set: rest });
      return res.status(200).json({
        message: 'Cập nhật tài khoản thành công',
        data: result,
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật tài khoản:', error);
      return res.status(500).json({
        message: 'Đã xảy ra lỗi khi cập nhật tài khoản',
        error: 1,
      });
    }
  }
  async deleteUserById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const result = await UsersDataBase.users.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({
        message: 'Xóa tài khoản thành công',
        data: result,
      });
    } catch (error) {
      console.error('Lỗi khi xóa tài khoản:', error);
      return res.status(500).json({
        message: 'Đã xảy ra lỗi khi xóa tài khoản',
        error: error,
      });
    }
  }
  async changePassword(req: Request, res: Response) {
    try{
      const headerRequest = req.headers.authorization;
      const payload = await verifyToken({ tokens:headerRequest as string});
      const user = await UsersDataBase.users.findOne({ _id: new ObjectId(payload._id)});
      if(!user) {
        throw new Error("User not found");
      }
      if(!await comparePassword(req.body.oldPassword, user.password)) {
        throw new Error("Password is incorrect");
      }
      const newPassword = await hashPassword(req.body.newPassword);
      const result = await UsersDataBase.users.updateOne({ _id: new ObjectId(payload._id)}, { $set: {password: newPassword}});
      return res.status(200).json({
        message: 'Cập nhật mật khẩu thành công',
        data: result,
      });
    }catch(error:any) {
      return res.status(400).json({
        error: 1,
        message: error?.message,
        data: null,
      })
    }
  }
}
export default new UserController();