import express from "express";
import prisma from "./prisma";
import applicationRoutes from "./routes/applicationRoutes";

const app = express();

app.use(express.json());

const PORT = 3000;


app.get("/", async (req, res) => {
    res.send("API is running...");
});

app.use("/api/applications", applicationRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

