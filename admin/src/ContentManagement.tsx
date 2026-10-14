import ChapterForm from "./ChapterForm";
import LessonForm from "./LessonForm";

function ContentManagement() {
    return (
        <div>
            <h1 style={{ textAlign: "center" }}>
                Content Management
            </h1>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    minHeight: "calc(100vh - 120px)"
                }}
            >
                <section
                    style={{
                        padding: "24px",
                        borderRight: "1px solid #d1d5db"
                    }}
                >
                    <ChapterForm />
                </section>

                <section
                    style={{
                        padding: "24px"
                    }}
                >
                    <LessonForm />
                </section>
            </div>
        </div>
    );
}

export default ContentManagement;