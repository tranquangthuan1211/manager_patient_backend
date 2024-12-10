export interface Favourite {
    id?: string;
    user_id: string;
    doctor_id: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}
export const initialFavourite: Favourite = {
    user_id: "string",
    doctor_id: "string",
    createdAt: "string",
}
export interface FavouriteDetail {
    id: string;
    user_id: string;
    doctor_id: string;
    doctor: {
        name: string;
        expertise:String;
        address: string;
    };
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}