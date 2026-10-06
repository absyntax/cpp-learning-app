import { Router } from "express";
import { db } from "../db/database.js";

const router = Router();

router.get("/chapter/:chapterId", (req, res) => {
    const chapterId = Number(req.params.chapterId);

    if (!Number.isInteger(chapterId)) {
        return res.status(400).json({
            error: "Invalid chapter ID."
        });
    }

    const lessons = db
        .prepare("SELECT * FROM lessons WHERE chapter_id = ? ORDER BY id ASC")
        .all(chapterId);

    res.json(lessons);
});

router.get("/", (_req, res) => {
    const lessons = db
        .prepare("SELECT * FROM lessons ORDER BY id ASC")
        .all();

    res.json(lessons);
});

router.post("/", (req, res) => {
    const { chapter_id, title, content } = req.body;

    if (!chapter_id || !title || !content) {
        return res.status(400).json({
            error: "chapter_id, title, and content are required."
        });
    }

    const result = db
        .prepare(`
            INSERT INTO lessons (chapter_id, title, content)
            VALUES (?, ?, ?)
        `)
        .run(chapter_id, title.trim(), content.trim());

    res.status(201).json({
        id: result.lastInsertRowid,
        chapter_id,
        title: title.trim(),
        content: content.trim()
    });
});

router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            error: "Invalid lesson ID."
        });
    }

    const result = db
        .prepare("DELETE FROM lessons WHERE id = ?")
        .run(id);

    if (result.changes === 0) {
        return res.status(404).json({
            error: "Lesson not found."
        });
    }

    res.json({
        message: "Lesson deleted successfully."
    });
});

router.put("/:id", (req, res) => {
    const id = Number(req.params.id);
    const { chapter_id, title, content } = req.body;

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            error: "Invalid lesson ID."
        });
    }

    if (!chapter_id || !title || !content) {
        return res.status(400).json({
            error: "chapter_id, title, and content are required."
        });
    }

    const result = db
        .prepare(`
            UPDATE lessons
            SET chapter_id = ?, title = ?, content = ?
            WHERE id = ?
        `)
        .run(
            chapter_id,
            title.trim(),
            content.trim(),
            id
        );

    if (result.changes === 0) {
        return res.status(404).json({
            error: "Lesson not found."
        });
    }

    res.json({
        id,
        chapter_id,
        title: title.trim(),
        content: content.trim()
    });
});

export default router;