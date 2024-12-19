
export interface Appointment {
    id: string,
    date:string,
    time:string,
    status:string,
    patient_id:string,
    doctor_id:string,
}

export const initialAppointment: Appointment = {
    id: '',
    date: "",
    status:"",
    time: '',
    patient_id: '',
    doctor_id: '',
}