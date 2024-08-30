import express from "express"
import DiseaseController from "../controllers/diseases.controller"
const router = express.Router()

function useRouteDisease(){
    router.get('/', DiseaseController.getDiseases)
    return router
}

export default useRouteDisease