import express from 'express'
import complaintsController from '../controllers/complaints.controller'
const router = express.Router()

function useRouteComplaint(){
    router.get('/', complaintsController.getComplaints)
    return router
}

export default useRouteComplaint