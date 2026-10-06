import { Router } from "express";
import { db } from "../db/database.js";

const router = Router();

router.get("/", (_req, res) => {
    const chapters = db
        .prepare("SELECT * FROM chapters ORDER BY id ASC")
        .all();

    res.json(chapters);
});

router.post("/", (req, res) => {
    const { title } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({
            error: "Chapter title is required."
        });
    }

    const result = db
        .prepare("INSERT INTO chapters (title) VALUES (?)")
        .run(title.trim());

    res.status(201).json({
        id: result.lastInsertRowid,
        title: title.trim()
    });
});

router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            error: "Invalid chapter ID."
        });
    }

    const result = db
        .prepare("DELETE FROM chapters WHERE id = ?")
        .run(id);

    if (result.changes === 0) {
        return res.status(404).json({
            error: "Chapter not found."
        });
    }

    res.json({
        message: "Chapter deleted successfully."
    });
});

router.put("/:id", (req, res) => {
    const id = Number(req.params.id);
    const { title } = req.body;

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            error: "Invalid chapter ID."
        });
    }

    if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({
            error: "Chapter title is required."
        });
    }

    const result = db
        .prepare("UPDATE chapters SET title = ? WHERE id = ?")
        .run(title.trim(), id);

    if (result.changes === 0) {
        return res.status(404).json({
            error: "Chapter not found."
        });
    }

    res.json({
        id,
        title: title.trim()
    });
});

export default router;