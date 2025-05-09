import { useDrag } from "@use-gesture/react";
import { calc } from "@vanilla-extract/css-utils";
import { CSSProperties, useContext, useEffect, useMemo } from "react";

import {
  useGroup,
  useResizers,
  useSelectedHierarchyIds,
  useSelectedResizers,
} from "../hierarchy";
import { StoryContext } from "../StoryProvider";
import { IRect } from "../types";
import {
  useAnimationEffect,
  useRequestAnimationFrame,
} from "../useAnimationEffect";
import { useSketchpadMode } from "../store";

export const useTopLeftResizer = () => {
  const storyProxy = useContext(StoryContext);
  const selectedHierarchyIds = useSelectedHierarchyIds();
  const group = useGroup();
  const syncedRect = group.syncedRect;
  const topLeft: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    if (syncedRect) {
      style.left = calc(`${syncedRect.x - 2}px`).toString();
      style.top = calc(`${syncedRect.y - 2}px`).toString();
    }

    return style;
  }, [syncedRect]);

  const topLeftBind = useDrag(({ delta: [dx, dy] }) => {
    selectedHierarchyIds.forEach((hierarchyId) => {
      const resizerProxy = storyProxy.resizers[hierarchyId];
      const syncedRectProxy = resizerProxy?.syncedRect;

      if (syncedRectProxy) {
        syncedRectProxy.x += dx;
        syncedRectProxy.width -= dx;
        syncedRectProxy.y += dy;
        syncedRectProxy.height -= dy;
      }
    });
  });

  return {
    topLeft,
    topLeftBind,
  };
};

export const useTopRightResizer = () => {
  const storyProxy = useContext(StoryContext);
  const selectedHierarchyIds = useSelectedHierarchyIds();
  const group = useGroup();
  const syncedRect = group.syncedRect;

  const topRight: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    if (syncedRect) {
      style.left = calc(`${syncedRect.x - 2}px`)
        .add(`${syncedRect.width}px`)
        .toString();
      style.top = calc(`${syncedRect.y - 2}px`).toString();
    }

    return style;
  }, [syncedRect]);

  const topRightBind = useDrag(({ delta: [dx, dy] }) => {
    selectedHierarchyIds.forEach((hierarchyId) => {
      const resizerProxy = storyProxy.resizers[hierarchyId];
      const syncedRectProxy = resizerProxy?.syncedRect;

      if (syncedRectProxy) {
        syncedRectProxy.width += dx;
        syncedRectProxy.y += dy;
        syncedRectProxy.height -= dy;
      }
    });
  });

  return {
    topRight,
    topRightBind,
  };
};

export const useBottomLeftResizer = () => {
  const storyProxy = useContext(StoryContext);
  const selectedHierarchyIds = useSelectedHierarchyIds();
  const group = useGroup();
  const syncedRect = group.syncedRect;

  const bottomLeft: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    if (syncedRect) {
      style.left = calc(`${syncedRect.x - 2}px`).toString();
      style.top = calc(`${syncedRect.y - 2}px`)
        .add(`${syncedRect.height}px`)
        .toString();
    }

    return style;
  }, [syncedRect]);

  const bottomLeftBind = useDrag(({ delta: [dx, dy] }) => {
    selectedHierarchyIds.forEach((hierarchyId) => {
      const resizerProxy = storyProxy.resizers[hierarchyId];
      const syncedRectProxy = resizerProxy?.syncedRect;

      if (syncedRectProxy) {
        syncedRectProxy.x += dx;
        syncedRectProxy.width -= dx;
        syncedRectProxy.height += dy;
      }
    });
  });

  return {
    bottomLeft,
    bottomLeftBind,
  };
};

export const useBottomRightResizer = () => {
  const storyProxy = useContext(StoryContext);
  const selectedHierarchyIds = useSelectedHierarchyIds();
  const group = useGroup();
  const syncedRect = group.syncedRect;

  const bottomRight: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    if (syncedRect) {
      style.left = calc(`${syncedRect.x - 2}px`)
        .add(`${syncedRect.width}px`)
        .toString();
      style.top = calc(`${syncedRect.y - 2}px`)
        .add(`${syncedRect.height}px`)
        .toString();
    }

    return style;
  }, [syncedRect]);

  const bottomRightBind = useDrag(({ delta: [dx, dy] }) => {
    selectedHierarchyIds.forEach((hierarchyId) => {
      const resizerProxy = storyProxy.resizers[hierarchyId];
      const syncedRectProxy = resizerProxy?.syncedRect;

      if (syncedRectProxy) {
        syncedRectProxy.width += dx;
        syncedRectProxy.height += dy;
      }
    });
  });

  return {
    bottomRight,
    bottomRightBind,
  };
};

export const useBodyResizer = () => {
  const storyProxy = useContext(StoryContext);
  const selectedHierarchyIds = useSelectedHierarchyIds();
  const group = useGroup();
  const syncedRect = group.syncedRect;

  const body: CSSProperties = useMemo(() => {
    const style: CSSProperties = {};

    if (syncedRect) {
      style.left = calc(`${syncedRect.x}px`).toString();
      style.top = calc(`${syncedRect.y}px`).toString();
      style.width = calc(`${syncedRect.width}px`).toString();
      style.height = calc(`${syncedRect.height}px`).toString();
    }

    return style;
  }, [syncedRect]);

  const bodyBind = useDrag(({ delta: [dx, dy] }) => {
    selectedHierarchyIds.forEach((hierarchyId) => {
      const resizerProxy = storyProxy.resizers[hierarchyId];
      const syncedRectProxy = resizerProxy?.syncedRect;

      if (syncedRectProxy) {
        syncedRectProxy.x += dx;
        syncedRectProxy.y += dy;
      }
    });
  });

  return {
    body,
    bodyBind,
  };
};

export const useResizerGroup = () => {
  const { body, bodyBind } = useBodyResizer();
  const { topLeft, topLeftBind } = useTopLeftResizer();
  const { topRight, topRightBind } = useTopRightResizer();
  const { bottomLeft, bottomLeftBind } = useBottomLeftResizer();
  const { bottomRight, bottomRightBind } = useBottomRightResizer();

  return {
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
  };
};

export const useSyncElements = () => {
  const selectedResizers = useSelectedResizers();
  const resizers = useResizers();
  const storyProxy = useContext(StoryContext);
  const sketchpadMode = useSketchpadMode();

  useRequestAnimationFrame(() => {
    if (!sketchpadMode) {
      return;
    }
    Object.values(resizers).forEach((resizer) => {
      if (resizer?.syncedRect == null) {
        return;
      }
      const element = document.querySelector(`[data-id="${resizer.id}"]`) as
        | HTMLElement
        | undefined;
      if (element && resizer.syncedRect && sketchpadMode) {
        const style = element.style;
        style.left = calc(`${resizer.syncedRect.x}px`).toString();
        style.top = calc(`${resizer.syncedRect.y}px`).toString();
        style.width = calc(`${resizer.syncedRect.width}px`).toString();
        style.height = calc(`${resizer.syncedRect.height}px`).toString();
      }
      const updateRect = element?.getBoundingClientRect();
      const resizerProxy = storyProxy.resizers[resizer.id];
      const syncedRectProxy = resizerProxy?.syncedRect;
      if (updateRect) {
        if (
          syncedRectProxy &&
          (updateRect.x !== resizer.syncedRect?.x ||
            updateRect.y !== resizer.syncedRect?.y ||
            updateRect.width !== resizer.syncedRect?.width ||
            updateRect.height !== resizer.syncedRect?.height)
        ) {
          syncedRectProxy.x = updateRect.x;
          syncedRectProxy.y = updateRect.y;
          syncedRectProxy.width = updateRect.width;
          syncedRectProxy.height = updateRect.height;
        }
      }
      if (resizerProxy?.syncedStyle && element?.style) {
        for (let i = 0; i < element?.style.length; i++) {
          const propertyName = element?.style[i];
          const propertyValue = element?.style.getPropertyValue(propertyName);
          resizerProxy.syncedStyle[propertyName] = propertyValue;
        }
      }
    });
  });

  useRequestAnimationFrame(() => {
    const rects: IRect[] = [];
    if (!sketchpadMode) {
      return;
    }
    selectedResizers.forEach((resizer) => {
      if (resizer?.syncedRect == null) {
        return;
      }
      const element = document.querySelector(`[data-id="${resizer.id}"]`) as
        | HTMLElement
        | undefined;

      const updateRect = element?.getBoundingClientRect();

      if (updateRect) {
        rects.push(updateRect);
      }
    });

    if (rects.length > 0) {
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      rects.forEach((rect) => {
        minX = Math.min(minX, rect.x);
        minY = Math.min(minY, rect.y);
        maxX = Math.max(maxX, rect.x + rect.width);
        maxY = Math.max(maxY, rect.y + rect.height);
      });

      if (storyProxy.group.syncedRect) {
        storyProxy.group.syncedRect.x = minX;
        storyProxy.group.syncedRect.y = minY;
        storyProxy.group.syncedRect.width = maxX - minX;
        storyProxy.group.syncedRect.height = maxY - minY;
      }
    }
  });
};

export const useListenSketchpadMode = () => {
  const storyProxy = useContext(StoryContext);
  const sketchpadMode = useSketchpadMode();
  const resizers = useResizers();

  useEffect(() => {
    Object.values(storyProxy.resizers).forEach((resizer) => {
      if (!sketchpadMode && resizer) {
        resizer.syncedRect = null;
      }
    });
  }, [storyProxy.resizers, sketchpadMode]);

  useAnimationEffect(() => {
    Object.values(resizers).forEach((resizer) => {
      if (resizer == null) {
        return;
      }
      const element = document.querySelector(`[data-id="${resizer.id}"]`) as
        | HTMLElement
        | undefined;
      if (element && sketchpadMode === false) {
        element.style = resizer.originStyleText ?? "";
      }
    });
  }, [resizers, sketchpadMode]);
};
