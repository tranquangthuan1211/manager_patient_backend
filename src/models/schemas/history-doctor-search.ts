export interface HistoryDoctorSearch {
    id: string;
    doctorId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export const initialHistoryDoctorSearch: HistoryDoctorSearch = {
    id: '',
    doctorId: '',
    userId: '',
    createdAt: '',
    updatedAt: '',
}