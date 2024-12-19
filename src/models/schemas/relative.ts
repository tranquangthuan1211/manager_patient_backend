export interface Relative {
    id: string;
    patient_id: string;
    name: string;
    phone: string;
    relationship: string;
}
export interface DetailedRelative {
    id:string;
    name: string;
    phone: string;
    relationship: string;
    patient_name: string;
}
export const initialRelative: Relative = {
    id: '',
    patient_id: '',
    name: '',
    phone: '',
    relationship: '',
}