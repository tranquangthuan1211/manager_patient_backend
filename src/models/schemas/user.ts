export interface Users {
    id: string;
    email: string;
    password: string;
    name: string;
    age: number;
    address: string ;
    location: string;
    gender: string;
    phone: string;
    consulting_day: string;
    role: string;
    status: string;
    expertise: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}

export const initialUser= {
    id: 'string',
    email: 'string',
    password: 'string',
    name: 'string',
    age: "number",
    address: 'string',
    location: 'string',
}

