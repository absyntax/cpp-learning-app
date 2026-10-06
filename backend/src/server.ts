import express from "express";
import cors from "cors";
import { db } from "./db/database.js";
import chapterRoutes from "./routes/chapterRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/chapters", chapterRoutes);
app.use("/api/lessons", lessonRoutes);
app.get("/", (_req, res) => {
    const result = db.prepare("SELECT 1 AS connected").get();

    res.json({
        message: "C++ Learning App Backend is running.",
        database: result
    });
});

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});