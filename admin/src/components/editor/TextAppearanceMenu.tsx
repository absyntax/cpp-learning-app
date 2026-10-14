
type TextAppearanceMenuProps = {
    fontSize: string;
    textColor: string;
    highlightColor: string;
    onFontSizeChange: (size: string) => void;
    onTextColorChange: (color: string) => void;
    onHighlightColorChange: (color: string) => void;
};

export default function TextAppearanceMenu({
    fontSize,
    textColor,
    highlightColor,
    onFontSizeChange,
    onTextColorChange,
    onHighlightColorChange
}: TextAppearanceMenuProps) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "8px",
                padding: "8px"
            }}
        >
            <label>
                Font size
                <select
                    value={fontSize}
                    onChange={(event) => {
                        onFontSizeChange(event.target.value);
                    }}
                >
                    {[
                        "12px",
                        "14px",
                        "16px",
                        "18px",
                        "20px",
                        "24px",
                        "28px",
                        "32px",
                        "36px"
                    ].map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Text color
                <input
                    type="color"
                    value={textColor}
                    onChange={(event) => {
                        onTextColorChange(event.target.value);
                    }}
                />
            </label>

            <label>
                Highlight
                <input
                    type="color"
                    value={highlightColor}
                    onChange={(event) => {
                        onHighlightColorChange(event.target.value);
                    }}
                />
            </label>
        </div>
    );
}