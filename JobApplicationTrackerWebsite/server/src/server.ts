import express from "express";

const app = express();

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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

