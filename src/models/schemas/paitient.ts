import { BaseModel } from "../base-model"
export interface PaitientBaseData {
    id: string;
    id_doctor: string;
    id_manager: string;
    name: string;
    age: number;
    address: string;
    gender: string;
    phone: string;
    password: string;
    role: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}
export const initialPaitientBaseData = {
    id: "",
    id_doctor: "",
    id_manager: "",
    name: "",
    age: 0,
    address: "",
    gender:"",
    phone: "",
    password: "",
    role: "",

}
// export interface Paitient extends PaitientBaseData, BaseModel {}