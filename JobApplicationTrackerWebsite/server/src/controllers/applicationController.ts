import type { Request, Response } from "express";
import prisma from "../prisma";
import { validateApplication } from "../validation/applicationValidation";


//return all stored job applications
export async function getApplications(req: Request, res: Response) {
    try {
        const applications = await prisma.jobApplication.findMany();

        res.json(applications);
    } catch (error){
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch applications",
        });
    }
}

//validate the request body and create a new application in the database
export async function createApplication(req: Request, res: Response) {
    try {

        const validationError = validateApplication(req.body);

        //invalid client input returns a 400 response instead of reaching Prisma
        if (validationError){
            return res.status(400).json({
                message: validationError,
            });
        }


        const newApplication = await prisma.jobApplication.create({
            data: {
                //trim user-entered strings before storing in database
                company: req.body.company.trim(),
                position: req.body.position.trim(),
                status: req.body.status.trim(),
                location: req.body.location.trim(),
                dateApplied: req.body.dateApplied.trim(),
                jobUrl: req.body.jobUrl.trim(),
                salary: req.body.salary.trim(),
                notes: req.body.notes.trim(),
            },
        });

        //indicate that a new resource was successfully created using code 201
        res.status(201).json(newApplication);
    } catch (error){
        console.error(error);

        res.status(500).json({
            message: "Failed to create application.",
        });
    }
}

//validate the application ID and request body before updating a record
export async function updateApplication(req: Request, res: Response) {
    try{
        const id = Number(req.params.id);

        //route parameters arrive as strings, so convert and validate ID first
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({
                message: "Invalid application ID."
            });
        }

        const validationError = validateApplication(req.body);

        if (validationError){
            return res.status(400).json({
                message: validationError,
            });
        }

        const updatedApplication = await prisma.jobApplication.update({
            where: {
                id,
            },
            data: {
                company: req.body.company.trim(),
                position: req.body.position.trim(),
                status: req.body.status.trim(),
                location: req.body.location.trim(),
                dateApplied: req.body.dateApplied.trim(),
                jobUrl: req.body.jobUrl.trim(),
                salary: req.body.salary.trim(),
                notes: req.body.notes.trim(),
            },
        });

        res.json(updatedApplication);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update application",
        });
    }
}

//validate requested ID and delete corresponding database record
export async function deleteApplication(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({
                message: "Invalid application ID."
            });
        }

        

        await prisma.jobApplication.delete({
            where: {
                id,
            },
        });

        //indicate successful request with no response body using code 204
        res.status(204).send();
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete application.",
        });
    }
}