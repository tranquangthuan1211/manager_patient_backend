export interface FavouriteClinic {
    id?: string;
    user_id: string;
    clinic_id: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}
export const initialFavourite: FavouriteClinic = {
    user_id: "string",
    clinic_id: "string",
    createdAt: "string",
}
export interface FavouriteClinicDetail {
    id: string;
    user_id: string;
    clinic_id: string;
    clinic: {
        name: string;
        expertise:String;
        address: string;
    };
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}