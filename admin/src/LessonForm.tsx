import { useEffect, useState } from "react";
import LessonContentEditor from "./LessonContentEditor";

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

    const [showForm, setShowForm] = useState(false);
    const [formChapterId, setFormChapterId] =
        useState<number | null>(null);

    const [editingLessonId, setEditingLessonId] =
        useState<number | null>(null);

    const [title, setTitle] = useState("");
    const [contentLesson, setContentLesson] =
    useState<Lesson | null>(null);

    async function loadData() {
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

    function openCreateForm(chapterId: number) {
        setFormChapterId(chapterId);
        setEditingLessonId(null);
        setTitle("");
        setShowForm(true);
    }

   function openEditForm(lesson: Lesson) {
    setFormChapterId(lesson.chapter_id);
    setEditingLessonId(lesson.id);
    setTitle(lesson.title);
    setShowForm(true);
}

    function closeForm() {
        setShowForm(false);
        setFormChapterId(null);
        setEditingLessonId(null);
        setTitle("");
    }

   async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!formChapterId || !title.trim()) {
        return;
    }

    if (editingLessonId !== null) {
        const lessonToUpdate = lessons.find(
            (lesson) => lesson.id === editingLessonId
        );

        const response = await fetch(
            `http://localhost:3000/api/lessons/${editingLessonId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chapter_id: formChapterId,
                    title: title.trim(),
                    content: lessonToUpdate?.content ?? ""
                })
            }
        );

        if (!response.ok) {
            alert("Failed to update lesson.");
            return;
        }
    } else {
        const response = await fetch(
            "http://localhost:3000/api/lessons",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chapter_id: formChapterId,
                    title: title.trim(),
                    content: ""
                })
            }
        );

        if (!response.ok) {
            alert("Failed to create lesson.");
            return;
        }
    }

    closeForm();
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
            closeForm();
        }

        await loadData();
    }

    if (contentLesson !== null) {
    return (
        <LessonContentEditor
    lesson={contentLesson}
    onBack={() => setContentLesson(null)}
/>
    );
}

    return (
        <section>
            <h2>Lessons</h2>

            {chapters.map((chapter) => {
                const chapterLessons = lessons.filter(
                    (lesson) =>
                        lesson.chapter_id === chapter.id
                );

                return (
                    <div
                        key={chapter.id}
                        style={{
                            marginBottom: "24px"
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            <h3>{chapter.title}</h3>

                            <button
                                type="button"
                                onClick={() =>
                                    openCreateForm(chapter.id)
                                }
                            >
                                + Add Lesson
                            </button>
                        </div>

                        {chapterLessons.length === 0 ? (
                            <p>No lessons.</p>
                        ) : (
                            <div>
                                {chapterLessons.map((lesson) => (
                                    <div
                                        key={lesson.id}
                                        style={{
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems: "center",
                                            padding: "12px",
                                            marginBottom: "8px",
                                            border:
                                                "1px solid #d1d5db",
                                            borderRadius: "6px"
                                        }}
                                    >
                                        <strong>
                                            {lesson.title}
                                        </strong>

                                        <div>
    <button
        type="button"
        onClick={() =>
            openEditForm(lesson)
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

    <button
    type="button"
  onClick={async () => {
    const response = await fetch(
        "http://localhost:3000/api/lessons"
    );

    if (!response.ok) {
        alert("Failed to load lesson content.");
        return;
    }

    const latestLessons: Lesson[] =
        await response.json();

    const latestLesson = latestLessons.find(
        (item) => item.id === lesson.id
    );

    if (!latestLesson) {
        alert("Failed to load lesson content.");
        return;
    }

    setLessons(latestLessons);
    setContentLesson(latestLesson);
}}
>
    Content
</button>
</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}

            {showForm && (
                <div
                    style={{
                        padding: "24px",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        background: "#f9fafb"
                    }}
                >
                    <h3>
                        {editingLessonId !== null
                            ? "Edit Lesson"
                            : "Create Lesson"}
                    </h3>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>
                                Lesson title
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(event) =>
                                    setTitle(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter lesson title"
                            />
                        </div>

                        <div
                            style={{
                                marginTop: "16px"
                            }}
                        >
                            <button
                                type="button"
                                onClick={closeForm}
                            >
                                Cancel
                            </button>

                            <button type="submit">
                                {editingLessonId !== null
                                    ? "Update Lesson"
                                    : "Create Lesson"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
}

export default LessonForm;