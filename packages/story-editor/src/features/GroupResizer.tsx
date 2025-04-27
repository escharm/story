import { Fragment, useCallback } from "react";

import {
  useHierarchies,
  useSelectedHierarchyIds,
  useSelectHierarchy,
} from "../hierarchy.ts";
import {
  useListenSketchpadMode,
  useResizerGroup,
  useSyncElements,
} from "./useResizerGroup.ts";
import { useSketchpadMode } from "../store.ts";

const GroupResizer = () => {
  const {
    bodyBind,
    topLeftBind,
    topRightBind,
    bottomLeftBind,
    bottomRightBind,
    body,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
  } = useResizerGroup();
  const sketchpadMode = useSketchpadMode();
  const selectedHierarchyIds = useSelectedHierarchyIds();
  const selectHierarchy = useSelectHierarchy();
  const flatHierarchy = useHierarchies();

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const findElementAtPoint = (
        id: string,
        point: { x: number; y: number },
      ): string | null => {
        const hierarchy = flatHierarchy[id];
        if (!hierarchy) return null;

        // 使用 querySelector 获取实际元素
        const element = document.querySelector(`[data-id="${id}"]`);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (
            point.x >= rect.left &&
            point.x <= rect.right &&
            point.y >= rect.top &&
            point.y <= rect.bottom
          ) {
            return id;
          }
        }

        // 递归检查子元素
        for (const childId of hierarchy.childIds) {
          const result = findElementAtPoint(childId, point);
          if (result) return result;
        }

        return null;
      };

      const childIds = selectedHierarchyIds.flatMap((id) => {
        const hierarchy = flatHierarchy[id];
        if (!hierarchy) return [];
        return hierarchy.childIds;
      });

      const point = { x: e.clientX, y: e.clientY };
      for (const id of childIds) {
        const foundId = findElementAtPoint(id, point);
        if (foundId) {
          selectHierarchy(foundId);
          return;
        }
      }
    },
    [flatHierarchy, selectedHierarchyIds, selectHierarchy],
  );

  useSyncElements();
  useListenSketchpadMode();

  if (selectedHierarchyIds.length === 0) {
    return null;
  }

  return (
    <Fragment>
      <div
        {...(sketchpadMode ? { ...bodyBind() } : {})}
        className="absolute bg-blue-400 opacity-50"
        onDoubleClickCapture={handleDoubleClick}
        style={{
          position: "absolute",
          backgroundColor: "blue",
          opacity: 0.5,
          cursor: sketchpadMode ? "move" : "default",
          touchAction: "none",
          ...body,
        }}
      />
      {sketchpadMode ? (
        <Fragment>
          <div
            {...topLeftBind()}
            style={{
              position: "absolute",
              backgroundColor: "black",
              cursor: "nwse-resize", // 左上角
              touchAction: "none",
              ...topLeft,
            }}
            className="top-left absolute bg-black"
          />
          <div
            {...topRightBind()}
            style={{
              position: "absolute",
              backgroundColor: "black",
              cursor: "nesw-resize", // 右上角
              touchAction: "none",
              ...topRight,
            }}
            className="top-right absolute bg-black"
          />
          <div
            {...bottomLeftBind()}
            style={{
              position: "absolute",
              backgroundColor: "black",
              cursor: "nesw-resize", // 左下角
              touchAction: "none",
              ...bottomLeft,
            }}
            className="bottom-left absolute bg-black"
          />
          <div
            {...bottomRightBind()}
            style={{
              position: "absolute",
              backgroundColor: "black",
              cursor: "nwse-resize", // 右下角
              touchAction: "none",
              ...bottomRight,
            }}
            className="bottom-right absolute bg-black"
          />
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default GroupResizer;
