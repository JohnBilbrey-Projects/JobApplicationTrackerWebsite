import { Router } from "express";
import { createApplication, deleteApplication, getApplications, updateApplication } from "../controllers/applicationController";

//router responsible for all /api/applications endpoints
const router = Router();

//retrieve all job applications
router.get("/", getApplications);
//create a new job applicaiton
router.post("/", createApplication);
//update an existing job application using its database ID
router.put("/:id", updateApplication);
//delete an existing application using its database ID
router.delete("/:id", deleteApplication);

export default router;