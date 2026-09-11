import type { Request, Response } from "express";
import prisma from "../prisma";
import { validateApplication } from "../validation/applicationValidation";

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

export async function createApplication(req: Request, res: Response) {
    try {

        const validationError = validateApplication(req.body);

        if (validationError){
            return res.status(400).json({
                message: validationError,
            });
        }


        const newApplication = await prisma.jobApplication.create({
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

        res.status(201).json(newApplication);
    } catch (error){
        console.error(error);

        res.status(500).json({
            message: "Failed to create application.",
        });
    }
}

export async function updateApplication(req: Request, res: Response) {
    try{
        const id = Number(req.params.id);

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
                company: req.body.company,
                position: req.body.position,
                status: req.body.status,
                location: req.body.location,
                dateApplied: req.body.dateApplied,
                jobUrl: req.body.jobUrl,
                salary: req.body.salary,
                notes: req.body.notes,
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

        res.status(204).send();
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete application.",
        });
    }
}