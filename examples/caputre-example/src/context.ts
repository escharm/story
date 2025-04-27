import { IFlatHierarchy, IGroupedRect, IFlatStructure } from "./types";
import { createContext, useContext } from "react";
import { proxy, useSnapshot } from "valtio";

const createDefaultData = () => {
  const hierarchyProxy = proxy<IFlatHierarchy>({});

  const groupedRectProxy = proxy<IGroupedRect>({
    rect: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
    manualOffset: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
    style: {},
    selectedHierarchyIds: [],
    selectedRects: {},
  });

  return {
    hierarchyProxy,
    groupedRectProxy,
  };
};

// 创建 Context
export const DataContext = createContext<{
  hierarchyProxy: IFlatHierarchy;
  groupedRectProxy: IGroupedRect;
}>(createDefaultData());

export const find = <T>(
  hierarchyProxy: IFlatStructure<T>,
  id?: string,
): Partial<T> => {
  const defaultProxy = proxy<Partial<T>>({});
  return id ? (hierarchyProxy[id] ?? defaultProxy) : defaultProxy;
};

export const useGroupedRect = () => {
  const { groupedRectProxy } = useContext(DataContext);
  return useSnapshot(groupedRectProxy);
};

export const useSelectedHierarchyIds = () => {
  const { groupedRectProxy } = useContext(DataContext);
  return useSnapshot(groupedRectProxy.selectedHierarchyIds);
};
