import FavouriteBase from '../../models/favourite-model';

async function getFavourites(id: string) {
    try {
      const userCount = await FavouriteBase.Favourite.countDocuments({ user_id: id });
      // console.log(`Number of users with role ${role}: ${userCount}`);
  
      if (userCount === 0) {
        return []; 
      }
      console.log(id)
      let pipeline: any[] = [
        { $match: { user_id: id } },
      ];
      pipeline.push({
          $lookup: {
              from: "users",
              let: { doctorId: { $toObjectId: "$doctor_id" } }, 
              pipeline: [
                  { $match: { $expr: { $eq: ["$_id", "$$doctorId"] } } },
                  { $project: { name: 1, _id: 1,image:1,expertise:1 }} 
              ],
              as: "doctor"
          }
      });
      pipeline.push({
        $project: {
          _id: 1,
          doctor: {
            id_doctor: { $arrayElemAt: ["$doctor._id", 0] },
            name: { $arrayElemAt: ["$doctor.name", 0] },
            expertise: { $arrayElemAt: ["$doctor.expertise", 0] },
            address: { $arrayElemAt: ["$doctor.address", 0] },
            location: { $arrayElemAt: ["$doctor.location", 0] },
            image: { $arrayElemAt: ["$doctor.image", 0] }

          },
          user_id: 1
        }
      });
  
      const data = await FavouriteBase.Favourite.aggregate(pipeline).toArray();

      // console.log(`Results for role ${role}:`, JSON.stringify(data, null, 2));
  
      return data;
    } catch (error) {
      console.error("Error in getUserInfoHandler:", error);
      throw error;
    }
}
export default getFavourites;