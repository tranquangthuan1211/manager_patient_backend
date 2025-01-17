export interface Review {
    id_user: string;
    id_clinic: string;
    rating: number;
    content: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}

export const ReviewBase: Review = {
    id_user: "",
    id_clinic: "",
    rating: 0,
    content: "",
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: new Date(),
};