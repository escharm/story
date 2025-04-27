import React from "react";

import { useCleanSelectedHierarchy, useSelectHierarchy } from "../hierarchy";

interface CaptureProps {
  children: React.ReactNode;
}

const Capture: React.FC<CaptureProps> = ({ children }) => {
  const selectedHierarchy = useSelectHierarchy();
  const cleanSelectedHierarchy = useCleanSelectedHierarchy();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLElement;

    if (target.dataset.id) {
      selectedHierarchy(target.dataset.id);
    } else {
      cleanSelectedHierarchy();
    }
  };

  return (
    <div
      id="escharm-story-capture"
      onClickCapture={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundSize: "20px 20px",
        backgroundImage:
          "linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)",
        backgroundColor: "#fff",
      }}
    >
      {children}
    </div>
  );
};

export default Capture;
