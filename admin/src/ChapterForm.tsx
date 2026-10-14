import { useEffect, useState } from "react";

type Chapter = {
    id: number;
    title: string;
    created_at: string;
};

function ChapterForm() {
    const [title, setTitle] = useState("");
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [showCreateCard, setShowCreateCard] = useState(false);
    const [editingChapterId, setEditingChapterId] =
    useState<number | null>(null);

const [showEditCard, setShowEditCard] = useState(false);

    async function loadChapters() {
        const response = await fetch(
            "http://localhost:3000/api/chapters"
        );

        if (!response.ok) {
            return;
        }

        const data: Chapter[] = await response.json();
        setChapters(data);
    }

    useEffect(() => {
    async function initializeChapters() {
        const response = await fetch(
            "http://localhost:3000/api/chapters"
        );

        if (!response.ok) {
            return;
        }

        const data: Chapter[] = await response.json();
        setChapters(data);
    }

    initializeChapters();
}, []);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!title.trim()) {
            return;
        }

        if (editingChapterId !== null) {
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
setShowEditCard(false);
await loadChapters();
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
        setShowCreateCard(false);
        await loadChapters();
    }

   function handleEditChapter(chapter: Chapter) {
    setEditingChapterId(chapter.id);
    setTitle(chapter.title);
    setShowEditCard(true);
}

    function handleCancelEdit() {
        setEditingChapterId(null);
        setTitle("");
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

    return (
        <section>
            <h2>Chapters</h2>

            <div>
                {chapters.map((chapter) => (
                    <div
                        key={chapter.id}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "12px",
                            marginBottom: "8px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px"
                        }}
                    >
                        <strong>{chapter.title}</strong>

                        <div>
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
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: "24px" }}>
                <button
                    type="button"
                    onClick={() => setShowCreateCard(true)}
                >
                    + Create Chapter
                </button>
            </div>

            {showCreateCard && (
                <div
                    style={{
                        marginTop: "16px",
                        padding: "24px",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        background: "#f9fafb"
                    }}
                >
                    <h3>Create Chapter</h3>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>
                                Chapter title
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                                placeholder="Enter chapter title"
                            />
                        </div>

                        <div style={{ marginTop: "16px" }}>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCreateCard(false);
                                    setTitle("");
                                }}
                            >
                                Cancel
                            </button>

                            <button type="submit">
                                Create Chapter
                            </button>
                        </div>
                    </form>
                </div>
            )}

{showEditCard && (
    <div
        style={{
            marginTop: "16px",
            padding: "24px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            background: "#f9fafb"
        }}
    >
        <h3>Edit Chapter</h3>

        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Chapter title
                </label>

                <input
                    type="text"
                    value={title}
                    onChange={(event) =>
                        setTitle(event.target.value)
                    }
                    placeholder="Enter chapter title"
                />
            </div>

            <div style={{ marginTop: "16px" }}>
                <button
                    type="button"
                    onClick={() => {
                        setShowEditCard(false);
                        setEditingChapterId(null);
                        setTitle("");
                    }}
                >
                    Cancel
                </button>

                <button type="submit">
                    Update Chapter
                </button>
            </div>
        </form>
    </div>
)}

        </section>
    );
}

export default ChapterForm;