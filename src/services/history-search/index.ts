import HistoryDoctorSearchDataBase from "../../models/history-doctor-search-model";
import { HistoryDoctorSearch } from "../../models/schemas/history-doctor-search";
export async function getHistoryDoctorSearchHandler(id: string) {
  try {
      console.log(id)
      let pipeline: any[] = [
        {
          $match: {
            userId: id
          }
        },
          {
              $lookup: {
                  from: "users",
                  let: { userId: { $toObjectId: "$userId" } }, 
                  pipeline: [
                      { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                      { $project: { name: 1, _id: 1 } } 
                  ],
                  as: "patient"
              }
          },
          {
            $lookup: {
                from: "users",
                let: { doctorId: { $toObjectId: "$doctorId" } }, 
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$doctorId"] } } },
                    { $project: { 
                        _id: 1,
                        email:1,
                        name: 1, 
                        age:1,
                        address:1,
                        location:1,
                        gender:1,
                        phone:1,
                        expertise:1,
                        rating:1,
                        review:1,

                    } } 
                ],
                as: "doctor"
            }
        },
          {
              $project: {
                    
                    doctorId: 1, // Bao gồm trường name
                    name: { $arrayElemAt: ["$doctor.name", 0] },
                    email: { $arrayElemAt: ["$doctor.email", 0] },
                    age: { $arrayElemAt: ["$doctor.age", 0] },
                    address: { $arrayElemAt: ["$doctor.address", 0] },
                    location: { $arrayElemAt: ["$doctor.location", 0] },
                    gender: { $arrayElemAt: ["$doctor.gender", 0] },
                    phone: { $arrayElemAt: ["$doctor.phone", 0] },
                    expertise: { $arrayElemAt: ["$doctor.expertise", 0] },
                    rating: { $arrayElemAt: ["$doctor.rating", 0] },
                    review: { $arrayElemAt: ["$doctor.review", 0] },
              }
          }
      ];

      const data = await HistoryDoctorSearchDataBase.historySearch.aggregate(pipeline).toArray();

      return data;
  } catch (err: any) {
      // Log chi tiết lỗi và pipeline để dễ dàng debug
      console.error("Error in getAppointmentsHandler:", err);
      throw new Error(`Failed to fetch appointments: ${err.message}`);
  }
}
