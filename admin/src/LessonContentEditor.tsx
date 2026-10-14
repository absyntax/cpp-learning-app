import { useEffect, useRef, useState } from "react";
import TextAppearanceMenu from "./components/editor/TextAppearanceMenu";
import BlockLibrarySidebar from "./components/editor/BlockLibrarySidebar";

type Lesson = {
    id: number;
    chapter_id: number;
    title: string;
    content: string;
};

type LessonContentEditorProps = {
    lesson: Lesson;
    onBack: () => void;
};

function LessonContentEditor({
    lesson,
    onBack
}: LessonContentEditorProps) {
    const [content, setContent] = useState(lesson.content);
    const [isBlockLibraryOpen, setIsBlockLibraryOpen] = useState(false);
    const [previewWidth, setPreviewWidth] = useState(50);
    const [saving, setSaving] = useState(false);
    const [boldTypingActive, setBoldTypingActive] = useState(false);
    const [boldActive, setBoldActive] = useState(false);
    const [italicActive, setItalicActive] = useState(false);
const [italicTypingActive, setItalicTypingActive] = useState(false);
const [underlineActive, setUnderlineActive] = useState(false);
const [underlineTypingActive, setUnderlineTypingActive] = useState(false);
const [strikeActive, setStrikeActive] = useState(false);
const [strikeTypingActive, setStrikeTypingActive] = useState(false);
const [superscriptActive, setSuperscriptActive] = useState(false);
const [superscriptTypingActive, setSuperscriptTypingActive] = useState(false);
const [subscriptActive, setSubscriptActive] = useState(false);
const [subscriptTypingActive, setSubscriptTypingActive] = useState(false);
const [activeTextType, setActiveTextType] = useState("Paragraph");
const [selectedFontSize, setSelectedFontSize] = useState("16px");
const [selectedTextColor, setSelectedTextColor] = useState("#000000");
const [selectedHighlightColor, setSelectedHighlightColor] = useState("#ffff00");

   const isDragging = useRef(false);
const editorRef = useRef<HTMLDivElement | null>(null);
const savedSelectionRangeRef = useRef<Range | null>(null);
const savedRangeRef = useRef<Range | null>(null);
const blockInsertionRangeRef = useRef<Range | null>(null);

useEffect(() => {
    if (!editorRef.current) {
        return;
    }

    if (!lesson.content.trim()) {
        editorRef.current.innerHTML = "<p><br></p>";
        return;
    }

editorRef.current.innerHTML = lesson.content
    .split(/\n\s*\n/)
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");}, [lesson.content]);


function updateInlineFormattingState() {
    const editor = editorRef.current;
    const selection = window.getSelection();

    if (!editor || !selection || selection.rangeCount === 0) {
        return;
    }

    const range = selection.getRangeAt(0);

    if (!editor.contains(range.commonAncestorContainer)) {
        return;
    }

    const isBold = document.queryCommandState("bold");
    const isItalic = document.queryCommandState("italic");
    const isUnderline = document.queryCommandState("underline");
    const isStrike = document.queryCommandState("strikeThrough");
    const isSuperscript = document.queryCommandState("superscript");
    const isSubscript = document.queryCommandState("subscript");

    setBoldActive(isBold);
    setBoldTypingActive(isBold);

    setItalicActive(isItalic);
    setItalicTypingActive(isItalic);

    setUnderlineActive(isUnderline);
    setUnderlineTypingActive(isUnderline);

    setStrikeActive(isStrike);
    setStrikeTypingActive(isStrike);

    setSuperscriptActive(isSuperscript);
    setSuperscriptTypingActive(isSuperscript);

    setSubscriptActive(isSubscript);
    setSubscriptTypingActive(isSubscript);

    const startElement =
        range.startContainer instanceof Element
            ? range.startContainer
            : range.startContainer.parentElement;

    const endElement =
        range.endContainer instanceof Element
            ? range.endContainer
            : range.endContainer.parentElement;

    const getStyleElement = (element: Element | null): HTMLElement | null => {
        let current: Element | null = element;

        while (current && current !== editor) {
            if (current instanceof HTMLElement && current.hasAttribute("style")) {
                return current;
            }

            current = current.parentElement;
        }

        return null;
    };

    const startStyleElement = getStyleElement(startElement);
    const endStyleElement = getStyleElement(endElement);

    const styleElement =
        startStyleElement &&
        endStyleElement &&
        (startStyleElement === endStyleElement ||
            startStyleElement.contains(endStyleElement) ||
            endStyleElement.contains(startStyleElement))
            ? startStyleElement.contains(endStyleElement)
                ? endStyleElement
                : startStyleElement
            : startStyleElement;

    if (!styleElement) {
        setSelectedFontSize("16px");
        setSelectedTextColor("#000000");
        setSelectedHighlightColor("#ffff00");
        return;
    }

    const computedStyle = window.getComputedStyle(styleElement);

    const fontSize = computedStyle.fontSize;
    const fontSizeOptions = [
        "12px", "14px", "16px", "18px", "20px",
        "24px", "28px", "32px", "36px"
    ];

    setSelectedFontSize(
        fontSizeOptions.includes(fontSize) ? fontSize : "16px"
    );

    const normalizeColor = (color: string): string => {
        const match = color.match(
            /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i
        );

        if (!match) return "#000000";

        return (
            "#" +
            [match[1], match[2], match[3]]
                .map((channel) =>
                    Number(channel).toString(16).padStart(2, "0")
                )
                .join("")
        );
    };

    setSelectedTextColor(normalizeColor(computedStyle.color));

    const backgroundColor = computedStyle.backgroundColor;
    setSelectedHighlightColor(
        backgroundColor === "rgba(0, 0, 0, 0)" ||
        backgroundColor === "transparent"
            ? "#ffff00"
            : normalizeColor(backgroundColor)
    );
}







function applyAppearanceStyle(
    property: "fontSize" | "color" | "backgroundColor",
    value: string
) {
    const editor = editorRef.current;
    const savedRange = savedRangeRef.current;

    if (
        !editor ||
        !savedRange ||
        savedRange.collapsed ||
        !editor.contains(savedRange.startContainer) ||
        !editor.contains(savedRange.endContainer)
    ) {
        return;
    }

    const selection = window.getSelection();

    if (!selection) return;

    const cssProperty =
        property === "fontSize"
            ? "font-size"
            : property === "backgroundColor"
              ? "background-color"
              : "color";

    const range = savedRange.cloneRange();

    editor.focus();
    selection.removeAllRanges();
    selection.addRange(range);

    const startElement =
        range.startContainer instanceof Element
            ? range.startContainer
            : range.startContainer.parentElement;

    const endElement =
        range.endContainer instanceof Element
            ? range.endContainer
            : range.endContainer.parentElement;

    // Find the nearest span shared by both selection endpoints.
    let commonSpan: HTMLSpanElement | null = null;
    let candidate = startElement?.closest("span");

    while (candidate && editor.contains(candidate)) {
        if (
            candidate instanceof HTMLSpanElement &&
            endElement &&
            candidate.contains(endElement)
        ) {
            commonSpan = candidate;
            break;
        }

        candidate = candidate.parentElement?.closest("span") ?? null;
    }

    if (commonSpan) {
        const selectedText = range.toString();
        const spanText = commonSpan.textContent ?? "";

        // Directly modify the existing span when the selected text
        // covers its complete textual content.
       if (
    selectedText.trim().length > 0 &&
    spanText.includes(selectedText)
) {
            // Remove duplicate declarations of this property from
            // descendant spans, then unwrap spans with no styles.
            commonSpan
                .querySelectorAll<HTMLSpanElement>("span")
                .forEach((span) => {
                    span.style.removeProperty(cssProperty);

                    if (!span.getAttribute("style")?.trim()) {
                        span.removeAttribute("style");
                    }
                });

            commonSpan.style.setProperty(cssProperty, value);

            const unwrapEmptySpans = (root: ParentNode) => {
                Array.from(
                    root.querySelectorAll<HTMLSpanElement>("span")
                )
                    .reverse()
                    .forEach((span) => {
                        if (
                            span.attributes.length === 0 &&
                            span.parentNode
                        ) {
                            span.replaceWith(
                                ...Array.from(span.childNodes)
                            );
                        }
                    });
            };

            unwrapEmptySpans(commonSpan);

            editor.normalize();
            setContent(editor.innerHTML);

            const updatedRange = document.createRange();
            updatedRange.selectNodeContents(commonSpan);

            selection.removeAllRanges();
            selection.addRange(updatedRange);

            savedRangeRef.current = updatedRange.cloneRange();
            savedSelectionRangeRef.current =
                updatedRange.cloneRange();

            updateInlineFormattingState();
            updateActiveTextType();
            return;
        }
    }

    // For partial selections, isolate the selected content.
    const fragment = range.extractContents();

    fragment
        .querySelectorAll<HTMLElement>("*")
        .forEach((element) => {
            element.style.removeProperty(cssProperty);

            if (!element.getAttribute("style")?.trim()) {
                element.removeAttribute("style");
            }
        });

    Array.from(fragment.childNodes).forEach((node) => {
        if (node instanceof HTMLElement) {
            node.style.removeProperty(cssProperty);

            if (!node.getAttribute("style")?.trim()) {
                node.removeAttribute("style");
            }
        }
    });

    const wrapper = document.createElement("span");
    wrapper.style.setProperty(cssProperty, value);
    wrapper.appendChild(fragment);

    range.insertNode(wrapper);
    editor.normalize();

    const updatedRange = document.createRange();
    updatedRange.selectNodeContents(wrapper);

    selection.removeAllRanges();
    selection.addRange(updatedRange);

    savedRangeRef.current = updatedRange.cloneRange();
    savedSelectionRangeRef.current = updatedRange.cloneRange();

    setContent(editor.innerHTML);
    updateInlineFormattingState();
    updateActiveTextType();
}



function updateActiveTextType() {
    const editor = editorRef.current;
    const selection = window.getSelection();

    if (!editor || !selection || selection.rangeCount === 0) {
        return;
    }

    const range = selection.getRangeAt(0);

    if (!editor.contains(range.commonAncestorContainer)) {
        return;
    }

    let node: Node | null = range.startContainer;

    if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentElement;
    }

    while (node && node !== editor) {
        if (node instanceof HTMLElement) {
            const tag = node.tagName.toLowerCase();

            const textTypes: Record<string, string> = {
                p: "Paragraph",
                h1: "Heading 1",
                h2: "Heading 2",
                h3: "Heading 3",
                blockquote: "Block Quote"
            };

            if (textTypes[tag]) {
                setActiveTextType(textTypes[tag]);
                return;
            }
        }

        node = node.parentNode;
    }

    setActiveTextType("Paragraph");
}



function saveEditorSelection() {
    const editor = editorRef.current;
    const selection = window.getSelection();

    if (!editor || !selection || selection.rangeCount === 0) {
        return;
    }

    const range = selection.getRangeAt(0);

    if (!editor.contains(range.commonAncestorContainer)) {
        return;
    }

    savedSelectionRangeRef.current = range.cloneRange();
    savedRangeRef.current = range.cloneRange();
}

function applyBold() {
    const editor = editorRef.current;

    if (!editor) {
        return;
    }

    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
        return;
    }

    const range = selection.getRangeAt(0);

    if (!editor.contains(range.commonAncestorContainer)) {
        return;
    }

    editor.focus();

    if (range.collapsed) {
        const nextBoldState = !boldTypingActive;

        document.execCommand(
            "bold",
            false
        );

        setBoldTypingActive(nextBoldState);
        setBoldActive(nextBoldState);
    } else {
        const selectedTextIsBold =
            document.queryCommandState("bold");

        const shouldMakeBold = !selectedTextIsBold;

        document.execCommand(
            "bold",
            false
        );

        setBoldTypingActive(shouldMakeBold);
        setBoldActive(shouldMakeBold);
    }

    setContent(editor.innerHTML);
}

    function handleDividerMouseDown() {
        isDragging.current = true;


        function handleMouseMove(event: MouseEvent) {
            if (!isDragging.current) {
                return;
            }

            const percentage =
                ((window.innerWidth - event.clientX) /
                    window.innerWidth) *
                100;

            const limitedPercentage = Math.min(
                Math.max(percentage, 25),
                75
            );

            setPreviewWidth(limitedPercentage);
        }

        function handleMouseUp() {
            isDragging.current = false;

            document.removeEventListener(
                "mousemove",
                handleMouseMove
            );

            document.removeEventListener(
                "mouseup",
                handleMouseUp
            );
        }

        document.addEventListener(
            "mousemove",
            handleMouseMove
        );

        document.addEventListener(
            "mouseup",
            handleMouseUp
        );
    }

   async function handleSave() {
    const currentContent =
        editorRef.current?.innerHTML ?? content;

    setSaving(true);

        const response = await fetch(
            `http://localhost:3000/api/lessons/${lesson.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chapter_id: lesson.chapter_id,
                    title: lesson.title,
                    content: currentContent
                })
            }
        );

        setSaving(false);

        if (!response.ok) {
    alert("Failed to save lesson content.");
    return;
}

alert("Lesson content saved successfully.");
onBack();
    }




    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                background: "white",
                zIndex: 1000,
                overflow: "hidden"
            }}
        >
            <header
                style={{
                    height: "64px",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 24px",
                    borderBottom: "1px solid #d1d5db",
                    boxSizing: "border-box"
                }}
            >
                <button
                    type="button"
                    onClick={onBack}
                >
                    ← Back
                </button>

                <h1
                    style={{
                        margin: 0,
                        fontSize: "22px"
                    }}
                >
                    {lesson.title}
                </h1>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <button
        type="button"

onClick={() => {
    saveEditorSelection();

    const editor = editorRef.current;
    const selection = window.getSelection();

    if (
        editor &&
        selection &&
        selection.rangeCount > 0 &&
        editor.contains(selection.anchorNode)
    ) {
        blockInsertionRangeRef.current =
            selection.getRangeAt(0).cloneRange();
    } else {
        blockInsertionRangeRef.current = null;
    }

    setIsBlockLibraryOpen(true);
}}
    >
        {isBlockLibraryOpen ? "Close blocks" : "Insert block"}
    </button>

    <button
        type="button"
        onClick={handleSave}
        disabled={saving}
    >
        {saving ? "Saving..." : "Save"}
    </button>
</div>
            </header>

            <div
    style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        overflow: "hidden"
    }}
>
   {isBlockLibraryOpen && (
    <BlockLibrarySidebar
        onClose={() => setIsBlockLibraryOpen(false)}

onSelectBlock={(blockType) => {
    if (blockType !== "black-box") {
        return;
    }

    const editor = editorRef.current;
    const savedRange = blockInsertionRangeRef.current;

    if (!editor) {
        return;
    }

    const block = document.createElement("div");

    block.dataset.contentBlock = "black-box";
    block.contentEditable = "false";
    block.style.cssText = [
        "width: 100%",
        "height: 120px",
        "background: #000000",
        "margin: 16px 0",
        "border-radius: 4px"
    ].join(";");

    if (
        savedRange &&
        editor.contains(savedRange.startContainer) &&
        editor.contains(savedRange.endContainer)
    ) {
        const range = savedRange.cloneRange();
range.deleteContents();

const startContainer = range.startContainer;
const startOffset = range.startOffset;

const paragraph =
    startContainer instanceof Element
        ? startContainer.closest("p, h1, h2, h3, h4, h5, h6, blockquote")
        : startContainer.parentElement?.closest(
              "p, h1, h2, h3, h4, h5, h6, blockquote"
          );

if (paragraph && editor.contains(paragraph)) {
    const splitRange = document.createRange();
    splitRange.setStart(startContainer, startOffset);
    splitRange.setEnd(paragraph, paragraph.childNodes.length);

    const trailingContent = splitRange.extractContents();
    const following = paragraph.cloneNode(false) as HTMLElement;
    following.appendChild(trailingContent);

    paragraph.parentNode?.insertBefore(block, paragraph.nextSibling);
    paragraph.parentNode?.insertBefore(following, block.nextSibling);

    const newRange = document.createRange();
newRange.setStart(following, 0);
newRange.collapse(true);

const selection = window.getSelection();

if (selection) {
    selection.removeAllRanges();
    selection.addRange(newRange);
}
} else {
    range.insertNode(block);
}
    } else {
        editor.appendChild(block);
    }

    setContent(editor.innerHTML);
    blockInsertionRangeRef.current = null;
    setIsBlockLibraryOpen(false);
    editor.focus();
}}
    />
)}

    <section
                    style={{
                        width: `${100 - previewWidth}%`,
                        minWidth: 0,
                        padding: "24px",
                        boxSizing: "border-box",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <h2>Editor</h2>

<div
    style={{
        display: "flex",
        gap: "8px",
        padding: "8px",
        marginBottom: "8px",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        background: "#f9fafb"
    }}
>
  <button
    type="button"
    onClick={applyBold}
    onMouseDown={(event) => event.preventDefault()}
    style={{
        backgroundColor: boldActive ? "#2563eb" : "#f3f4f6",
        color: boldActive ? "#ffffff" : "#111827",
        border: "1px solid #d1d5db",
        borderRadius: "4px",
        padding: "6px 12px"
    }}
>
    Bold
</button>

    
<button
    type="button"
    onMouseDown={(event) => event.preventDefault()}
    onClick={() => {
        const editor = editorRef.current;

        if (!editor) {
            return;
        }

        const selection = window.getSelection();

        if (!selection || selection.rangeCount === 0) {
            return;
        }

        const range = selection.getRangeAt(0);

        if (!editor.contains(range.commonAncestorContainer)) {
            return;
        }

        editor.focus();

        if (range.collapsed) {
            const nextItalicState = !italicTypingActive;

            document.execCommand("italic", false);

            setItalicTypingActive(nextItalicState);
            setItalicActive(nextItalicState);
        } else {
            const selectedTextIsItalic =
                document.queryCommandState("italic");

            const shouldMakeItalic = !selectedTextIsItalic;

            document.execCommand("italic", false);

            setItalicTypingActive(shouldMakeItalic);
            setItalicActive(shouldMakeItalic);
        }

        setContent(editor.innerHTML);
    }}
    style={{
        backgroundColor: italicActive ? "#2563eb" : "#f3f4f6",
        color: italicActive ? "#ffffff" : "#111827",
        border: "1px solid #d1d5db",
        borderRadius: "4px",
        padding: "6px 12px"
    }}
>
    Italic
</button>



<button
    type="button"
    onMouseDown={(event) => event.preventDefault()}
    onClick={() => {
        const editor = editorRef.current;

        if (!editor) {
            return;
        }

        const selection = window.getSelection();

        if (!selection || selection.rangeCount === 0) {
            return;
        }

        const range = selection.getRangeAt(0);

        if (!editor.contains(range.commonAncestorContainer)) {
            return;
        }

        editor.focus();

        if (range.collapsed) {
            const nextUnderlineState = !underlineTypingActive;

            document.execCommand("underline", false);

            setUnderlineTypingActive(nextUnderlineState);
            setUnderlineActive(nextUnderlineState);
        } else {
            const selectedTextIsUnderlined =
                document.queryCommandState("underline");

            const shouldUnderline = !selectedTextIsUnderlined;

            document.execCommand("underline", false);

            setUnderlineTypingActive(shouldUnderline);
            setUnderlineActive(shouldUnderline);
        }

        setContent(editor.innerHTML);
    }}
    style={{
        backgroundColor: underlineActive ? "#2563eb" : "#f3f4f6",
        color: underlineActive ? "#ffffff" : "#111827",
        border: "1px solid #d1d5db",
        borderRadius: "4px",
        padding: "6px 12px",
        textDecoration: "underline"
    }}
>
    Underline
</button>


<button
    type="button"
    onMouseDown={(event) => event.preventDefault()}
    onClick={() => {
        const editor = editorRef.current;

        if (!editor) {
            return;
        }

        const selection = window.getSelection();

        if (!selection || selection.rangeCount === 0) {
            return;
        }

        const range = selection.getRangeAt(0);

        if (!editor.contains(range.commonAncestorContainer)) {
            return;
        }

        editor.focus();

        if (range.collapsed) {
            const nextStrikeState = !strikeTypingActive;

            document.execCommand("strikeThrough", false);

            setStrikeTypingActive(nextStrikeState);
            setStrikeActive(nextStrikeState);
        } else {
            const selectedTextIsStruck =
                document.queryCommandState("strikeThrough");

            const shouldStrike = !selectedTextIsStruck;

            document.execCommand("strikeThrough", false);

            setStrikeTypingActive(shouldStrike);
            setStrikeActive(shouldStrike);
        }

        setContent(editor.innerHTML);
    }}
    style={{
        backgroundColor: strikeActive ? "#2563eb" : "#f3f4f6",
        color: strikeActive ? "#ffffff" : "#111827",
        border: "1px solid #d1d5db",
        borderRadius: "4px",
        padding: "6px 12px",
        textDecoration: "line-through"
    }}
>
    Strikethrough
</button>

<button
    type="button"
    onMouseDown={(event) => event.preventDefault()}
    onClick={() => {
        const editor = editorRef.current;

        if (!editor) {
            return;
        }

        const selection = window.getSelection();

        if (!selection || selection.rangeCount === 0) {
            return;
        }

        const range = selection.getRangeAt(0);

        if (!editor.contains(range.commonAncestorContainer)) {
            return;
        }

        editor.focus();

        if (range.collapsed) {
            const nextSuperscriptState = !superscriptTypingActive;

            document.execCommand("superscript", false);

            setSuperscriptTypingActive(nextSuperscriptState);
            setSuperscriptActive(nextSuperscriptState);
        } else {
            const selectedTextIsSuperscript =
                document.queryCommandState("superscript");

            const shouldSuperscript = !selectedTextIsSuperscript;

            document.execCommand("superscript", false);

            setSuperscriptTypingActive(shouldSuperscript);
            setSuperscriptActive(shouldSuperscript);
        }

        setContent(editor.innerHTML);
    }}
    style={{
        backgroundColor: superscriptActive ? "#2563eb" : "#f3f4f6",
        color: superscriptActive ? "#ffffff" : "#111827",
        border: "1px solid #d1d5db",
        borderRadius: "4px",
        padding: "6px 12px"
    }}
>
    Superscript
</button>


<button
    type="button"
    onMouseDown={(event) => event.preventDefault()}
    onClick={() => {
        const editor = editorRef.current;

        if (!editor) {
            return;
        }

        const selection = window.getSelection();

        if (!selection || selection.rangeCount === 0) {
            return;
        }

        const range = selection.getRangeAt(0);

        if (!editor.contains(range.commonAncestorContainer)) {
            return;
        }

        editor.focus();

        if (range.collapsed) {
            const nextSubscriptState = !subscriptTypingActive;

            document.execCommand("subscript", false);

            setSubscriptTypingActive(nextSubscriptState);
            setSubscriptActive(nextSubscriptState);
        } else {
            const selectedTextIsSubscript =
                document.queryCommandState("subscript");

            const shouldSubscript = !selectedTextIsSubscript;

            document.execCommand("subscript", false);

            setSubscriptTypingActive(shouldSubscript);
            setSubscriptActive(shouldSubscript);
        }

        setContent(editor.innerHTML);
    }}
    style={{
        backgroundColor: subscriptActive ? "#2563eb" : "#f3f4f6",
        color: subscriptActive ? "#ffffff" : "#111827",
        border: "1px solid #d1d5db",
        borderRadius: "4px",
        padding: "6px 12px"
    }}
>
    Subscript
</button>


   <div style={{ position: "relative" }}>

    
    <button
        type="button"
        onMouseDown={(event) => {
            event.preventDefault();
        }}
        onClick={() => {
            const selection = window.getSelection();

            if (
                selection &&
                selection.rangeCount > 0 &&
                editorRef.current?.contains(
                    selection.anchorNode
                )
            ) {
                savedRangeRef.current =
                    selection.getRangeAt(0).cloneRange();
            }

            const menu =
                document.getElementById(
                    "text-type-menu"
                );

            if (menu) {
                menu.style.display =
                    menu.style.display === "block"
                        ? "none"
                        : "block";
            }
        }}
    >
        {activeTextType} ▾
    </button>

    <div
        id="text-type-menu"
        style={{
            display: "none",
            position: "absolute",
            top: "100%",
            left: 0,
            background: "white",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            padding: "4px",
            zIndex: 10
        }}
    >
        {[
            ["p", "Paragraph"],
            ["h1", "Heading 1"],
            ["h2", "Heading 2"],
            ["h3", "Heading 3"],
            ["blockquote", "Block Quote"]
        ].map(([tag, label]) => (
            <button
                key={tag}
                type="button"
                onMouseDown={(event) => {
                    event.preventDefault();
                }}
              
onClick={() => {
    const editor = editorRef.current;
    const selection = window.getSelection();

    if (
        !editor ||
        !selection ||
        selection.rangeCount === 0 ||
        selection.isCollapsed
    ) {
        return;
    }

    const range = selection.getRangeAt(0);

    if (
        !editor.contains(range.startContainer) ||
        !editor.contains(range.endContainer)
    ) {
        return;
    }

    savedRangeRef.current = range.cloneRange();

    editor.focus();

    selection.removeAllRanges();
    selection.addRange(savedRangeRef.current);

    document.execCommand("formatBlock", false, tag);

    setContent(editor.innerHTML);
    updateActiveTextType();

    const menu = document.getElementById("text-type-menu");

    if (menu) {
        menu.style.display = "none";
    }
}}

                style={{
                    display: "block",
                    width: "100%",
                    border: "none",
                    background: "white",
                    textAlign: "left",
                    padding: "8px 12px",
                    cursor: "pointer"
                }}
            >
                {label}
            </button>
        ))}
    </div>
</div>

    <div style={{ position: "relative" }}>
    <button
        type="button"
        onClick={() => {
            const menu =
                document.getElementById(
                    "list-type-menu"
                );

            if (menu) {
                menu.style.display =
                    menu.style.display === "block"
                        ? "none"
                        : "block";
            }
        }}
    >
        List ▾
    </button>

    <div
        id="list-type-menu"
        style={{
            display: "none",
            position: "absolute",
            top: "100%",
            left: 0,
            background: "white",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            padding: "4px",
            zIndex: 10
        }}
    >
        <button
            type="button"
            onClick={() => {
                document.execCommand(
                    "insertUnorderedList",
                    false
                );

                editorRef.current?.focus();

                setContent(
                    editorRef.current?.innerHTML ?? ""
                );

                const menu =
                    document.getElementById(
                        "list-type-menu"
                    );

                if (menu) {
                    menu.style.display = "none";
                }
            }}
        >
            Bulleted List
        </button>

        <button
            type="button"
            onClick={() => {
                document.execCommand(
                    "insertOrderedList",
                    false
                );

                editorRef.current?.focus();

                setContent(
                    editorRef.current?.innerHTML ?? ""
                );

                const menu =
                    document.getElementById(
                        "list-type-menu"
                    );

                if (menu) {
                    menu.style.display = "none";
                }
            }}
        >
            Numbered List
        </button>
    </div>
</div>

<button
    type="button"
    onMouseDown={(event) => event.preventDefault()}
    
onClick={() => {
    const editor = editorRef.current;
    const savedRange = savedRangeRef.current;

    if (
        !editor ||
        !savedRange ||
        savedRange.collapsed ||
        !editor.contains(savedRange.startContainer) ||
        !editor.contains(savedRange.endContainer)
    ) {
        return;
    }

    const selection = window.getSelection();

    if (!selection) {
        return;
    }

    editor.focus();

    selection.removeAllRanges();
    selection.addRange(savedRange.cloneRange());

    // Remove browser-supported character formatting.
    document.execCommand("removeFormat", false);

    // Explicitly remove bold, italic, underline, strike,
    // superscript and subscript from the selected content.
    const commands = [
        "bold",
        "italic",
        "underline",
        "strikeThrough",
        "superscript",
        "subscript"
    ];

    for (const command of commands) {
        if (document.queryCommandState(command)) {
            document.execCommand(command, false);
        }
    }

    // Remove custom appearance styles from selected text wrappers.
    const currentSelection = window.getSelection();

    if (
        currentSelection &&
        currentSelection.rangeCount > 0
    ) {
        const currentRange = currentSelection.getRangeAt(0);

        const fragment = currentRange.extractContents();

        fragment.querySelectorAll("*").forEach((element) => {
            if (!(element instanceof HTMLElement)) {
                return;
            }

            element.style.removeProperty("font-size");
            element.style.removeProperty("color");
            element.style.removeProperty("background-color");

            if (!element.getAttribute("style")?.trim()) {
                element.removeAttribute("style");
            }

            if (
                ["B", "STRONG", "I", "EM", "U", "S",
                 "STRIKE", "SUB", "SUP", "FONT"].includes(
                    element.tagName
                )
            ) {
                element.replaceWith(...Array.from(element.childNodes));
            }
        });

        currentRange.insertNode(fragment);
    }

    editor.normalize();
    setContent(editor.innerHTML);
    saveEditorSelection();
    updateInlineFormattingState();
}}

>
    Clear Formatting
</button>



<TextAppearanceMenu
    fontSize={selectedFontSize}
    textColor={selectedTextColor}
    highlightColor={selectedHighlightColor}
    onFontSizeChange={(size) => {
        setSelectedFontSize(size);
        applyAppearanceStyle("fontSize", size);
    }}
    onTextColorChange={(color) => {
        setSelectedTextColor(color);
        applyAppearanceStyle("color", color);
    }}
    onHighlightColorChange={(color) => {
        setSelectedHighlightColor(color);
        applyAppearanceStyle("backgroundColor", color);
    }}
/>

</div>

<div
    ref={editorRef}
    contentEditable
    suppressContentEditableWarning

  onInput={(event) => {
    setContent(event.currentTarget.innerHTML);
    updateInlineFormattingState();
    updateActiveTextType();
}}
onKeyUp={() => {
    saveEditorSelection();
    updateInlineFormattingState();
    updateActiveTextType();
}}
onMouseUp={() => {
    saveEditorSelection();
    updateInlineFormattingState();
    updateActiveTextType();
}}

  
onKeyDown={(event) => {
    const editor = editorRef.current;
    const selection = window.getSelection();

    if (!editor || !selection || selection.rangeCount === 0) {
        return;
    }

    const range = selection.getRangeAt(0);

    if (!editor.contains(range.commonAncestorContainer)) {
        return;
    }

    const element =
        range.startContainer instanceof HTMLElement
            ? range.startContainer
            : range.startContainer.parentElement;

    if (event.key === "Enter" && !event.shiftKey && range.collapsed) {
        const block = element?.closest("h1, h2, h3, blockquote");

        if (block && editor.contains(block)) {
            const isAtEnd = (() => {
                const afterRange = range.cloneRange();
                afterRange.selectNodeContents(block);
                afterRange.setStart(range.endContainer, range.endOffset);
                return afterRange.toString().length === 0;
            })();

            if (isAtEnd) {
                event.preventDefault();

                const paragraph = document.createElement("p");
                paragraph.innerHTML = "<br>";

                block.parentNode?.insertBefore(
                    paragraph,
                    block.nextSibling
                );

                const newRange = document.createRange();
                newRange.setStart(paragraph, 0);
                newRange.collapse(true);

                selection.removeAllRanges();
                selection.addRange(newRange);

                setContent(editor.innerHTML);
                updateActiveTextType();
                saveEditorSelection();
            }
        }

        return;
    }

    if (event.key === "Tab") {
        const listItem = element?.closest("li");

        if (!listItem) {
            return;
        }

        event.preventDefault();

        document.execCommand(
            event.shiftKey ? "outdent" : "indent",
            false
        );

        setContent(editor.innerHTML);
        saveEditorSelection();
        updateActiveTextType();
    }
}}


    style={{
    width: "100%",
    flex: 1,
    minHeight: 0,
    boxSizing: "border-box",
    padding: "16px",
    border: "1px solid #d1d5db",
    overflowY: "auto",
    fontFamily: "Arial, sans-serif",
    fontSize: "16px",
    lineHeight: "1.6",
    margin: 0,
    outline: "none"
}}
>
</div>

<div
    style={{
        display: "flex",
        justifyContent: "center",
        padding: "16px 0",
        flexShrink: 0
    }}
>
    <button
        type="button"
        onClick={() => setIsBlockLibraryOpen(true)}
        style={{
            padding: "10px 20px",
            border: "1px dashed #9ca3af",
            borderRadius: "8px",
            background: "#ffffff",
            color: "#374151",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500
        }}
    >
        + Add block
    </button>
</div>

                </section>

                <div
                    onMouseDown={handleDividerMouseDown}
                    style={{
                        width: "6px",
                        flexShrink: 0,
                        cursor: "col-resize",
                        background: "#d1d5db"
                    }}
                />

                <section
                    style={{
                        width: `${previewWidth}%`,
                        minWidth: 0,
                        padding: "24px",
                        boxSizing: "border-box",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <h2>Preview</h2>

                    
const previewStyles = (
    <style>
        {`
          
.lesson-content-preview p,
[contenteditable="true"] p {
    font-size: 16px;
    font-weight: 400;
    margin: 0 0 16px;
}

.lesson-content-preview h1,
[contenteditable="true"] h1 {
    font-size: 32px;
    font-weight: 700;
    line-height: 1.25;
    margin: 24px 0 16px;
}

.lesson-content-preview h2,
[contenteditable="true"] h2 {
    font-size: 26px;
    font-weight: 700;
    line-height: 1.3;
    margin: 22px 0 14px;
}

.lesson-content-preview h3,
[contenteditable="true"] h3 {
    font-size: 21px;
    font-weight: 700;
    line-height: 1.4;
    margin: 20px 0 12px;
}

.lesson-content-preview blockquote,
[contenteditable="true"] blockquote {
    margin: 16px 0;
    padding: 8px 16px;
    border-left: 4px solid #9ca3af;
    color: #4b5563;
    background: #f9fafb;
    font-style: italic;
}

        `}
    </style>
);


                    <article
                        style={{
                            flex: 1,
                            minHeight: 0,
                            overflowY: "auto",
                            paddingRight: "12px"
                        }}
                    >
                        <h1>{lesson.title}</h1>

                        {content ? (
   
<div
    className="lesson-content-preview"
    style={{
        lineHeight: "1.6",
        fontSize: "16px",
        color: "#1f2937"
    }}
    dangerouslySetInnerHTML={{
        __html: content
    }}
/>

) : (
    <p>
        Start typing to see the
        preview.
    </p>
)}
                            <p>
                                Start typing to see the
                                preview.
                            </p>
                        
                    </article>
                </section>
            </div>
        </div>
    );
}

export default LessonContentEditor;