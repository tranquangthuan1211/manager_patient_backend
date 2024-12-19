
import BlogDataBase from "../../models/blog-model";
import { Blog } from "../../models/schemas/blog";
export async function getRelativeHandler(id: string) {
  try {
      console.log(id)
      let pipeline: any[] = [
        {
          $match: {
            user_id: id
          }
        },
          {
              $lookup: {
                  from: "users",
                  let: { userId: { $toObjectId: "$user_id" } }, 
                  pipeline: [
                      { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                      { $project: { name: 1, _id: 0 } } 
                  ],
                  as: "user"
              }
          },
          {
              $project: {
                  _id: 1, // Bao gồm trường _id
                  title: 1, // Bao gồm trường name
                  content:1,
                  patient_name: { $arrayElemAt: ["$user.name", 0] } // Lấy giá trị đầu tiên trong mảng doctor.name
              }
          }
      ];

      const data = await BlogDataBase.blogs.aggregate(pipeline).toArray();

      return data;
  } catch (err: any) {
      // Log chi tiết lỗi và pipeline để dễ dàng debug
      console.error("Error in getAppointmentsHandler:", err);
      throw new Error(`Failed to fetch appointments: ${err.message}`);
  }
}
