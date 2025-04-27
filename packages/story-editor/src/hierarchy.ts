import { useCallback, useContext, useMemo } from "react";
import { proxy, useSnapshot, ref } from "valtio";

import type {
  IFlatHierarchy,
  IFlatStructure,
  IHierarchy,
  IRect,
  IResizer,
} from "./types.ts";
import { StoryContext } from "./StoryProvider.tsx";

export const useStory = () => {
  const storyProxy = useContext(StoryContext);
  return useSnapshot(storyProxy);
};

export const useGroup = () => {
  const story = useStory();
  return story.group;
};

export const useSelectedHierarchyIds = () => {
  const story = useStory();
  return story.group.selectedHierarchyIds;
};

export const find = <T>(
  hierarchyProxy: IFlatStructure<T>,
  id?: string,
): Partial<T> => {
  const defaultProxy = proxy<Partial<T>>({});
  return id ? (hierarchyProxy[id] ?? defaultProxy) : defaultProxy;
};

export const useHierarchies = () => {
  const story = useStory();
  return story.hierarchies;
};

export const useResizers = () => {
  const story = useStory();
  return story.resizers;
};

export function useHierarchy(id: string | undefined): Partial<IHierarchy> {
  const hierarchies = useHierarchies();
  return useMemo(() => {
    if (!id) {
      return {};
    }
    return hierarchies[id] ?? {};
  }, [hierarchies, id]);
}

export const useSelectHierarchy = () => {
  const storyProxy = useContext(StoryContext);

  const selectedHierarchy = useCallback(
    (hierarchyId: string) => {
      storyProxy.group.selectedHierarchyIds = [hierarchyId];
      const rects: IRect[] = [];
      const rect = getHierarchyRect(hierarchyId, storyProxy.hierarchies);
      rects.push(rect);
      storyProxy.group.selectedRects[hierarchyId] = rect;

      const { x, y, width, height } = rect;
      const resizerProxy = (storyProxy.resizers[hierarchyId] ??=
        proxy<IResizer>({
          id: hierarchyId,
        }));

      resizerProxy.syncedRect ??= proxy({
        x,
        y,
        width,
        height,
      });

      resizerProxy.syncedStyle ??= proxy({});

      const element = document.querySelector(`[data-id="${hierarchyId}"]`) as
        | HTMLElement
        | undefined;

      if (!resizerProxy.originNode) {
        const targegtNode = element?.cloneNode(false);
        if (targegtNode) {
          resizerProxy.originNode = ref(targegtNode);
        }
      }

      if (element?.style) {
        const computedStyle = element.style;
        // 遍历所有计算样式并直接设置到originData.style
        for (let i = 0; i < computedStyle.length; i++) {
          const propertyName = computedStyle[i];
          const propertyValue = computedStyle.getPropertyValue(propertyName);
          resizerProxy.syncedStyle[propertyName] = propertyValue;
        }
      }
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
        } else {
          storyProxy.group.syncedRect = {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
          };
        }
      }
    },
    [storyProxy],
  );

  return selectedHierarchy;
};

export const getHierarchyRect = (
  hierarchyId: string,
  hierarchyProxy: IFlatHierarchy,
): IRect => {
  const hierarchy = hierarchyProxy[hierarchyId];
  if (!hierarchy) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  const element = document.querySelector(`[data-id="${hierarchyId}"]`);
  if (!element) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  const rect = element.getBoundingClientRect();
  return rect;
};

export const useSelectedHierarchies = () => {
  const selectedIds = useSelectedHierarchyIds();
  const hierarchies = useHierarchies();

  return useMemo(() => {
    return selectedIds
      .map((id) => hierarchies[id])
      .filter(Boolean) as IHierarchy[];
  }, [selectedIds, hierarchies]);
};

export const useSelectedResizers = () => {
  const selectedIds = useSelectedHierarchyIds();
  const resizers = useResizers();

  return useMemo(() => {
    return selectedIds.map((id) => resizers[id]).filter(Boolean) as IResizer[];
  }, [selectedIds, resizers]);
};

export const useCleanSelectedHierarchy = () => {
  const storyProxy = useContext(StoryContext);

  return useCallback(() => {
    storyProxy.group.selectedHierarchyIds = [];
    storyProxy.group.selectedRects = {};
    storyProxy.group.syncedRect = null;
  }, [storyProxy]);
};
