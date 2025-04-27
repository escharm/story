import type { ISaveHierarchyParams } from "../types.ts";

export const saveHierarchyChange = (params: ISaveHierarchyParams) => {
  import.meta.hot?.send("SAVE_HIERARCHY_CHANGE", params);
};
