
import type { CSSProperties } from "react";

type BlockLibrarySidebarProps = {
    onClose: () => void;
    onSelectBlock: (blockType: string) => void;
};

const panelStyle: CSSProperties = {
    width: "300px",
    minWidth: "300px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#ffffff",
    borderLeft: "1px solid #e5e7eb",
    boxSizing: "border-box"
};

const headerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px",
    borderBottom: "1px solid #e5e7eb"
};

export default function BlockLibrarySidebar({
    onClose,
    onSelectBlock
}: BlockLibrarySidebarProps) {
    return (
        <aside style={panelStyle}>
            <div style={headerStyle}>
                <h2 style={{ margin: 0, fontSize: "17px" }}>
                    Content blocks
                </h2>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close content blocks"
                    style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: "20px"
                    }}
                >
                    ×
                </button>
            </div>

            <div style={{ padding: "16px" }}>
                <button
                    type="button"
                    onClick={() => onSelectBlock("black-box")}
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        background: "#ffffff",
                        cursor: "pointer",
                        textAlign: "left"
                    }}
                >
                    <span
                        aria-hidden="true"
                        style={{
                            width: "36px",
                            height: "36px",
                            background: "#000000",
                            borderRadius: "4px",
                            flexShrink: 0
                        }}
                    />

                    <span>
                        <strong style={{ display: "block" }}>
                            Black box
                        </strong>
                        <span style={{ fontSize: "12px", color: "#6b7280" }}>
                            Temporary insertion test
                        </span>
                    </span>
                </button>
            </div>
        </aside>
    );
}
