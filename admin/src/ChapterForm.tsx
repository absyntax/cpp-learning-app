import { useEffect, useState } from "react";

type Chapter = {
    id: number;
    title: string;
    created_at: string;
};

type Lesson = {
    id: number;
    chapter_id: number;
    title: string;
};

function ChapterForm() {
    const [title, setTitle] = useState("");
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [editingChapterId, setEditingChapterId] = useState<number | null>(
        null
    );

    async function loadChapters() {
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

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!title.trim()) {
            return;
        }

        if (editingChapterId !== null) {
            await handleUpdateChapter();
            return;
        }

        const response = await fetch(
            "http://localhost:3000/api/chapters",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title.trim()
                })
            }
        );

        if (!response.ok) {
            alert("Failed to create chapter.");
            return;
        }

        setTitle("");

        await loadChapters();
    }

    function handleEditChapter(chapter: Chapter) {
        setEditingChapterId(chapter.id);
        setTitle(chapter.title);
    }

    async function handleUpdateChapter() {
        if (
            editingChapterId === null ||
            !title.trim()
        ) {
            return;
        }

        const response = await fetch(
            `http://localhost:3000/api/chapters/${editingChapterId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title.trim()
                })
            }
        );

        if (!response.ok) {
            alert("Failed to update chapter.");
            return;
        }

        setTitle("");
        setEditingChapterId(null);

        await loadChapters();
    }

    function handleCancelEdit() {
        setTitle("");
        setEditingChapterId(null);
    }

    async function handleDeleteChapter(chapterId: number) {
        const response = await fetch(
            `http://localhost:3000/api/chapters/${chapterId}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            alert("Failed to delete chapter.");
            return;
        }

        if (editingChapterId === chapterId) {
            handleCancelEdit();
        }

        await loadChapters();
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

        await loadChapters();
    }

    return (
        <div>
            <h2>
                {editingChapterId !== null
                    ? "Edit Chapter"
                    : "Create Chapter"}
            </h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Chapter title"
                    value={title}
                    onChange={(event) =>
                        setTitle(event.target.value)
                    }
                />

                <button type="submit">
                    {editingChapterId !== null
                        ? "Update Chapter"
                        : "Create Chapter"}
                </button>

                {editingChapterId !== null && (
                    <button
                        type="button"
                        onClick={handleCancelEdit}
                    >
                        Cancel
                    </button>
                )}
            </form>

            <h3>Chapters</h3>

            <ul>
                {chapters.map((chapter) => (
                    <li key={chapter.id}>
                        <strong>
                            {chapter.title}
                        </strong>

                        <button
                            type="button"
                            onClick={() =>
                                handleEditChapter(chapter)
                            }
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                handleDeleteChapter(chapter.id)
                            }
                        >
                            Delete
                        </button>

                        {lessons.some(
                            (lesson) =>
                                lesson.chapter_id === chapter.id
                        ) && (
                            <ul>
                                {lessons
                                    .filter(
                                        (lesson) =>
                                            lesson.chapter_id ===
                                            chapter.id
                                    )
                                    .map((lesson) => (
                                        <li key={lesson.id}>
                                            {lesson.title}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteLesson(
                                                        lesson.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChapterForm;