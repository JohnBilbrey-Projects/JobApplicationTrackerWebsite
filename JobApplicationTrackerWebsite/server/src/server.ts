import express from "express";

const app = express();

app.use(express.json());

const PORT = 3000;

const applications = [
  {
    id: 1,
    company: "Microsoft",
    position: "Software Engineer",
    status: "Rejected",
    location: "Remote",
    dateApplied: "2026-09-09",
    jobUrl: "https://microsoft.com",
    salary: "$70,000",
    notes: "none",
  },
  {
    id: 2,
    company: "Google",
    position: "Software Engineer",
    status: "Rejected",
    location: "Remote",
    dateApplied: "2026-09-09",
    jobUrl: "https://google.com",
    salary: "$85,000",
    notes: "none",
  },
];

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.get("/api/applications", (req, res) => {
    res.json(applications);
})

app.post("/api/applications", (req, res) => {
    const newApplication = {
        id: Date.now(),
        ...req.body,
    };
    applications.unshift(newApplication);

    res.status(201).json(newApplication);
});

app.delete("/api/applications/:id", (req, res) => {
    const id = Number(req.params.id);

    const applicationIndex = applications.findIndex(
        (application) => application.id === id
    );

    if (applicationIndex === -1){
        return res.status(404).json({message: "Application not found."});
    }

    applications.splice(applicationIndex, 1);

    res.status(204).send();
})

app.put("/api/applications/:id", (req, res) => {
    const id = Number(req.params.id);

    const applicationIndex = applications.findIndex(
        (application) => application.id === id
    );

    if (applicationIndex === -1){
        return res.status(404).json({
            message: "Application not found."
        });
    }

    const updatedApplication = {
        id,
        ...req.body,
    };

    applications[applicationIndex] = updatedApplication;

    res.json(updatedApplication);
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

