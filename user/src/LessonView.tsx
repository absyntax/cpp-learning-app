type Lesson = {
    id: number;
    chapter_id: number;
    title: string;
    content: string;
};

type LessonViewProps = {
    lesson: Lesson;
};

function LessonView({ lesson }: LessonViewProps) {
    return (
        <article>
            <h3>{lesson.title}</h3>

            <div>
                {lesson.content}
            </div>
        </article>
    );
}

export default LessonView;