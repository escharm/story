import React from "react";
import { IHierarchy } from "../types";

interface MultiElementStylePanelProps {
  hierarchies: IHierarchy[];
}

export const MultiElementStylePanel = ({
  hierarchies,
}: MultiElementStylePanelProps) => {
  return (
    <div className="multi-element-panel">
      <h4>共选中 {hierarchies.length} 个元素</h4>
    </div>
  );
};
