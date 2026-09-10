import type { Request, Response } from "express";
import prisma from "../prisma";

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
        const newApplication = await prisma.jobApplication.create({
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