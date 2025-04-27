import { proxy, useSnapshot } from "valtio";
import { useCallback } from "react";

export const panelProxy = proxy<{
  selectedPanel: string | null;
  sketchpadMode: boolean;
}>({
  selectedPanel: null,
  sketchpadMode: false,
});

export const useSelectedPanel = () => {
  return useSnapshot(panelProxy).selectedPanel;
};

export const useSketchpadMode = () => {
  return useSnapshot(panelProxy).sketchpadMode;
};

export const useToggleSketchpadMode = () => {
  return useCallback(() => {
    panelProxy.sketchpadMode = !panelProxy.sketchpadMode;
  }, []);
};

export const toggleSketchpadMode = () => {
  panelProxy.sketchpadMode = !panelProxy.sketchpadMode;
};
