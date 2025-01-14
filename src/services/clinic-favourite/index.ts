import FavouriteClinicBase from '../../models/clinic-favourite-model';

async function getFavouritesClinic(id: string) {
    try {
      const userCount = await FavouriteClinicBase.FavouriteClinic.countDocuments({ user_id: id });
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
              from: "clinic",
              let: { clinicId: { $toObjectId: "$clinic_id" } }, 
              pipeline: [
                  { $match: { $expr: { $eq: ["$_id", "$$clinicId"] } } },
                  { $project: { name: 1, _id: 0,image:1,expertise:1 }} 
              ],
              as: "clinic"
          }
      });
      pipeline.push({
        $project: {
          _id: 0,
          clinic: {
            name: { $arrayElemAt: ["$clinic.name", 0] },
            expertise: { $arrayElemAt: ["$clinic.expertise", 0] },
            address: { $arrayElemAt: ["$clinic.address", 0] },
            location: { $arrayElemAt: ["$clinic.location", 0] },
            image: { $arrayElemAt: ["$clinic.image", 0] }

          },
          user_id: 1
        }
      });
  
      const data = await FavouriteClinicBase.FavouriteClinic.aggregate(pipeline).toArray();

      // console.log(`Results for role ${role}:`, JSON.stringify(data, null, 2));
  
      return data;
    } catch (error) {
      console.error("Error in getUserInfoHandler:", error);
      throw error;
    }
}
export default getFavouritesClinic;