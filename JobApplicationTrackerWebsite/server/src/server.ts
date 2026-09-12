import express from "express";
import applicationRoutes from "./routes/applicationRoutes";

const app = express();

//parse incoming JSON requests bodies so route handlers can access req.body
app.use(express.json());

//port used by express API during local development and production
const PORT = 3000;

//simple health check route used to confirm api is running
app.get("/", (req, res) => {
    res.send("API is running...");
});

//Mount all job application routes under /api/applications path
app.use("/api/applications", applicationRoutes);

//start the express server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

