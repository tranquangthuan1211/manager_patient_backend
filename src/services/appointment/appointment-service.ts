import AppointmentDataBase from "../../models/appointment-model";
import {Appointment} from "../../models/schemas/appointment";
export async function getAppointmentsHandler(id: string) {
  try {
      // Tạo pipeline để join với bảng users
      console.log(id)
      let pipeline: any[] = [
        {
          $match: {
            $or: [
              { doctor_id: id },
              { patient_id: id }
            ]
          }
        },
          {
              $lookup: {
                  from: "users",
                  let: { doctorId: { $toObjectId: "$doctor_id" } }, 
                  pipeline: [
                      { $match: { $expr: { $eq: ["$_id", "$$doctorId"] } } },
                      { $project: { name: 1, _id: 0,image:1,expertise:1 }} 
                  ],
                  as: "doctor"
              }
          },
          {
              $lookup: {
                  from: "users",
                  let: { patientId: { $toObjectId: "$patient_id" } }, 
                  pipeline: [
                      { $match: { $expr: { $eq: ["$_id", "$$patientId"] } } },
                      { $project: { name: 1, _id: 0 } }
                  ],
                  as: "patient"
              }
          },
          {
              $project: {
                  _id: 1, // Bao gồm trường _id
                  date: 1, // Bao gồm trường date
                  time: 1, // Bao gồm trường time
                  status: 1, // Bao gồm trường status
                  doctor_name: { $arrayElemAt: ["$doctor.name", 0] }, // Lấy tên bác sĩ từ mảng
                  patient_name: { $arrayElemAt: ["$patient.name", 0] }, // Lấy tên bệnh nhân từ mảng
                  doctor_image: { $arrayElemAt: ["$doctor.image", 0] },
                  doctor_expertise: { $arrayElemAt: ["$doctor.expertise", 0] }
              }
          }
      ];

      // Thực thi pipeline và trả về kết quả
      const data = await AppointmentDataBase.appointments.aggregate(pipeline).toArray();

      return data;
  } catch (err: any) {
      // Log chi tiết lỗi và pipeline để dễ dàng debug
      console.error("Error in getAppointmentsHandler:", err);
      throw new Error(`Failed to fetch appointments: ${err.message}`);
  }
}
