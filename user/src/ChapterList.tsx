import { useEffect, useState } from "react";
import LessonList from "./LessonList";

type Chapter = {
    id: number;
    title: string;
};

function ChapterList() {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [selectedChapterId, setSelectedChapterId] = useState<number | null>(
        
        null
    );
    const [error, setError] = useState("");

 useEffect(() => {
    async function loadChapters() {
        try {
            const response = await fetch(
                "http://localhost:3000/api/chapters"
            );

            if (!response.ok) {
                setError("Failed to load chapters.");
                return;
            }

            const data: Chapter[] = await response.json();
            setChapters(data);
        } catch {
            setError("Unable to connect to the server.");
        }
    }

    loadChapters();
}, []);
    function handleChapterClick(chapterId: number) {
        if (selectedChapterId === chapterId) {
            setSelectedChapterId(null);
        } else {
            setSelectedChapterId(chapterId);
        }
    }

    return (
        <div>
            <h2>Chapters</h2>
{error && (
    <div>
        <p>{error}</p>

        <button onClick={() => window.location.reload()}>
            Retry
        </button>
    </div>
)}
            <ul>
                {chapters.map((chapter) => (
                    <li key={chapter.id}>
                        <button
                            onClick={() => handleChapterClick(chapter.id)}
                        >
                            {chapter.title}
                        </button>

                        {selectedChapterId === chapter.id && (
                            <LessonList chapterId={chapter.id} />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChapterList;