import express from "express";
import prisma from "./prisma";

const app = express();

app.use(express.json());

const PORT = 3000;



app.get("/", async (req, res) => {
    res.send("API is running...");
});

app.get("/api/applications", async (req, res) => {
    try {
        const applications = await prisma.jobApplication.findMany();

        res.json(applications);
    } catch (error){
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch applications",
        });
    }
})

app.post("/api/applications", async (req, res) => {
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
});

app.delete("/api/applications/:id", async (req, res) => {
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
});

app.put("/api/applications/:id", async (req, res) => {
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
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

