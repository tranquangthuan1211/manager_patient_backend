import { create } from "domain";
import ReviewDataBase from "../../models/review-model";
import { Review } from "../../models/schemas/review";
export async function getReviewHandler(id: string) {
  try {
      console.log(id)
      let pipeline: any[] = [
        {
          $match: {
            id_clinic: id,
          }
        },
          {
              $lookup: {
                  from: "clinic",
                  let: { idClinic: { $toObjectId: "$id_clinic" } }, 
                  pipeline: [
                      { $match: { $expr: { $eq: ["$_id", "$$idClinic"] } } },
                      { $project: { name: 1, _id: 0 } } 
                  ],
                  as: "clinic"
              }
          },
          {
            $lookup: {
                from: "users",
                let: { idUser: { $toObjectId: "$id_user" } }, 
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$idUser"] } } },
                    { $project: { name: 1, _id: 0 } } 
                ],
                as: "user"
            }
        },
            {
                $project: {
                    _id: 0,
                    id: 1,
                    name_user: { $arrayElemAt: ["$user.name", 0] },
                    name_clinic: { $arrayElemAt: ["$clinic.name", 0] } ,
                    content:1,
                    created_at:1,
                }
          }
      ];

      const data = await ReviewDataBase.clinics.aggregate(pipeline).toArray();

      return data;
  } catch (err: any) {
      // Log chi tiết lỗi và pipeline để dễ dàng debug
      console.error("Error in getAppointmentsHandler:", err);
      throw new Error(`Failed to fetch appointments: ${err.message}`);
  }
}
