import { type ReactNode, useMemo, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { nanoid } from "nanoid";

import { panelProxy, useSelectedPanel } from "../store.ts";

interface PanelProps {
  title: string;
  children: ReactNode;
  position: "left" | "right";
  top?: number;
  defaultCollapsed?: boolean;
  style?: React.CSSProperties; // 新增
}

export const Panel = (props: PanelProps) => {
  const {
    top,
    title,
    children,
    position,
    defaultCollapsed = false,
    style,
  } = props;

  const panelIdRef = useRef(nanoid());
  const selectedPanel = useSelectedPanel();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
    panelProxy.selectedPanel = panelIdRef.current;
  };

  const currentSelected = useMemo(() => {
    return panelIdRef.current === selectedPanel;
  }, [selectedPanel]);

  return (
    <div
      style={{
        position: "fixed",
        top: top ?? "16px",
        [position]: "16px",
        backgroundColor: "white",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        maxHeight: "80vh",
        overflowY: "auto",
        transform: isCollapsed
          ? `translateX(${position === "left" ? "-32px" : "32px"})`
          : "translateX(0)",
        transition: "transform 0.2s ease",
        zIndex: currentSelected ? 100 : "auto",
        ...style, // 合并外部传入的 style
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: isCollapsed ? "0" : "16px",
          cursor: "pointer",
        }}
        onClick={toggleCollapse}
      >
        <h3 style={{ margin: 0 }}>{title}</h3>
        <span
          style={{
            display: "flex",
            justifyContent: "space-between",
            transition: "transform 0.2s ease",
            transform: isCollapsed ? "rotate(0deg)" : "rotate(180deg)",
            margin: "8px",
          }}
        >
          <ChevronDownIcon height={16} />
        </span>
      </div>
      {!isCollapsed && children}
    </div>
  );
};
