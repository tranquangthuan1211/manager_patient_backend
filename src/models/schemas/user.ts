export interface Users {
    id: string;
    patient_code: string;
    id_doctor: string;
    id_manager: string;
    name: string;
    age: number;
    address: string;
    gender: string;
    phone: string;
    password: string;
    consulting_day: string;
    role: string;
    status: string;
    major: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}

