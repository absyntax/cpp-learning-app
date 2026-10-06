import { useEffect, useState } from "react";
import LessonView from "./LessonView";

type Lesson = {
    id: number;
    chapter_id: number;
    title: string;
    content: string;
};

type LessonListProps = {
    chapterId: number;
};

function LessonList({ chapterId }: LessonListProps) {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [selectedLessonId, setSelectedLessonId] = useState<number | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

 useEffect(() => {
    async function loadLessons() {
        setSelectedLessonId(null);
        setLoading(true);
       setError("");
       setLessons([]);

        try {
            const response = await fetch(
                `http://localhost:3000/api/lessons/chapter/${chapterId}`
            );

            if (!response.ok) {
                setError("Failed to load lessons.");
                setLoading(false);
                return;
            }

            const data: Lesson[] = await response.json();

            setLessons(data);
            setLoading(false);
        } catch {
            setError("Unable to connect to the server.");
            setLoading(false);
        }
    }

    loadLessons();
}, [chapterId]);

if (loading) {
    return (
        <div>
            <h3>Lessons</h3>
            <p>Loading lessons...</p>
        </div>
    );
}

if (error) {
    return (
        <div>
            <h3>Lessons</h3>
            <p>{error}</p>

            <button onClick={() => window.location.reload()}>
                Retry
            </button>
        </div>
    );
}

if (lessons.length === 0) {
    return (
        <div>
            <h3>Lessons</h3>
            <p>No lessons available in this chapter.</p>
        </div>
    );
}
const selectedLesson = lessons.find(
    (lesson) => lesson.id === selectedLessonId
);
    return (
        <div>
            <h3>Lessons</h3>

            <ul>
                {lessons.map((lesson) => (
                    <li key={lesson.id}>
                        <button
                           onClick={() =>
    setSelectedLessonId(
        selectedLessonId === lesson.id ? null : lesson.id
    )
}
                        >
                            {lesson.title}
                        </button>
                    </li>
                ))}
            </ul>

            {selectedLesson && (
                <LessonView lesson={selectedLesson} />
            )}
        </div>
    );
}

export default LessonList;