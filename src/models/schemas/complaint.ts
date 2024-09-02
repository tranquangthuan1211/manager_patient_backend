export interface Complaint {
    id: string;
    patient_id: string;
    doctor_id: string;
    manager_id: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}