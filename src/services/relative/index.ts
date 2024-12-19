import RelativeDataBase from "../../models/relative-model"
import { Relative } from "../../models/schemas/relative";
export async function getRelativeHandler(id: string) {
  try {
      console.log(id)
      let pipeline: any[] = [
        {
          $match: {
            patient_id: id
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
                  name: 1, // Bao gồm trường name
                  phone:1,
                  relationship:1,
                  patient_name: { $arrayElemAt: ["$patient.name", 0] } // Lấy giá trị đầu tiên trong mảng doctor.name
              }
          }
      ];

      const data = await RelativeDataBase.relatives.aggregate(pipeline).toArray();

      return data;
  } catch (err: any) {
      // Log chi tiết lỗi và pipeline để dễ dàng debug
      console.error("Error in getAppointmentsHandler:", err);
      throw new Error(`Failed to fetch appointments: ${err.message}`);
  }
}
