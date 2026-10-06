import { useEffect, useState } from "react";

type Chapter = {
    id: number;
    title: string;
};

type Lesson = {
    id: number;
    chapter_id: number;
    title: string;
    content: string;
};

function LessonForm() {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);

    const [chapterId, setChapterId] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState("");

    async function loadData() {
        const chapterResponse = await fetch(
            "http://localhost:3000/api/chapters"
        );

        if (!chapterResponse.ok) {
            return;
        }

        const chapterData: Chapter[] = await chapterResponse.json();
        setChapters(chapterData);

        const lessonResponse = await fetch(
            "http://localhost:3000/api/lessons"
        );

        if (!lessonResponse.ok) {
            return;
        }

        const lessonData: Lesson[] = await lessonResponse.json();
        setLessons(lessonData);
    }

    useEffect(() => {
    async function initializeData() {
        const chapterResponse = await fetch(
            "http://localhost:3000/api/chapters"
        );

        if (!chapterResponse.ok) {
            return;
        }

        const chapterData: Chapter[] =
            await chapterResponse.json();

        setChapters(chapterData);

        const lessonResponse = await fetch(
            "http://localhost:3000/api/lessons"
        );

        if (!lessonResponse.ok) {
            return;
        }

        const lessonData: Lesson[] =
            await lessonResponse.json();

        setLessons(lessonData);
    }

    initializeData();
}, []);

    function resetForm() {
        setChapterId("");
        setTitle("");
        setContent("");
        setEditingLessonId(null);
    }

    function handleEditLesson(lesson: Lesson) {
        setEditingLessonId(lesson.id);
        setChapterId(String(lesson.chapter_id));
        setTitle(lesson.title);
        setContent(lesson.content);
        setSuccessMessage("");
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!chapterId || !title.trim() || !content.trim()) {
            return;
        }

        if (editingLessonId !== null) {
            const response = await fetch(
                `http://localhost:3000/api/lessons/${editingLessonId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        chapter_id: Number(chapterId),
                        title: title.trim(),
                        content: content.trim()
                    })
                }
            );

            if (!response.ok) {
                alert("Failed to update lesson.");
                return;
            }

            resetForm();
            setSuccessMessage("Lesson updated successfully.");

            await loadData();
            return;
        }

        const response = await fetch(
            "http://localhost:3000/api/lessons",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chapter_id: Number(chapterId),
                    title: title.trim(),
                    content: content.trim()
                })
            }
        );

        if (!response.ok) {
            alert("Failed to create lesson.");
            return;
        }

        resetForm();
        setSuccessMessage("Lesson created successfully.");

        await loadData();
    }

    async function handleDeleteLesson(lessonId: number) {
        const response = await fetch(
            `http://localhost:3000/api/lessons/${lessonId}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            alert("Failed to delete lesson.");
            return;
        }

        if (editingLessonId === lessonId) {
            resetForm();
        }

        await loadData();
    }

    function handleCancelEdit() {
        resetForm();
        setSuccessMessage("");
    }

    return (
        <div>
            <h2>
                {editingLessonId !== null
                    ? "Edit Lesson"
                    : "Create Lesson"}
            </h2>

            {successMessage && (
                <p>{successMessage}</p>
            )}

            <form onSubmit={handleSubmit}>
                <select
                    value={chapterId}
                    onChange={(event) => {
                        setChapterId(event.target.value);
                        setSuccessMessage("");
                    }}
                >
                    <option value="">
                        Select chapter
                    </option>

                    {chapters.map((chapter) => (
                        <option
                            key={chapter.id}
                            value={chapter.id}
                        >
                            {chapter.title}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Lesson title"
                    value={title}
                    onChange={(event) => {
                        setTitle(event.target.value);
                        setSuccessMessage("");
                    }}
                />

                <textarea
                    placeholder="Lesson content"
                    value={content}
                    onChange={(event) => {
                        setContent(event.target.value);
                        setSuccessMessage("");
                    }}
                    rows={8}
                />

                <button type="submit">
                    {editingLessonId !== null
                        ? "Update Lesson"
                        : "Create Lesson"}
                </button>

                {editingLessonId !== null && (
                    <button
                        type="button"
                        onClick={handleCancelEdit}
                    >
                        Cancel
                    </button>
                )}
            </form>

            <h3>Lessons</h3>

            {lessons.length === 0 ? (
                <p>No lessons available.</p>
            ) : (
                <ul>
                    {lessons.map((lesson) => {
                        const chapter = chapters.find(
                            (item) =>
                                item.id === lesson.chapter_id
                        );

                        return (
                            <li key={lesson.id}>
                                <strong>
                                    {lesson.title}
                                </strong>

                                <span>
                                    {" "}(
                                    {chapter
                                        ? chapter.title
                                        : "Unknown chapter"}
                                    )
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleEditLesson(lesson)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDeleteLesson(lesson.id)
                                    }
                                >
                                    Delete
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default LessonForm;