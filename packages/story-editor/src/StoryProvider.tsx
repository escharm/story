import React, { useCallback, useEffect, useRef } from "react";
import { createContext } from "react";
import { proxy } from "valtio";

import { IGroup, IStoryContext, IUpdateTWStyleParams } from "./types";

const createDefaultData = (): IStoryContext => {
  const hierarchies = {};
  const resizers = {};
  const group: IGroup = {
    selectedHierarchyIds: [],
    selectedRects: {},
    syncedRect: null,
  };

  return proxy({
    hierarchies,
    resizers,
    group,
    storyNames: [],
    styledContainer: {},
  });
};

// eslint-disable-next-line react-refresh/only-export-components
export const StoryContext = createContext<IStoryContext>(createDefaultData());

interface IProps {
  children: React.ReactNode;
}

const StoryProvider = (props: IProps) => {
  const { children } = props;
  const defaultValueRef = useRef<IStoryContext>(createDefaultData());
  const styleRef = useRef<HTMLStyleElement>(null);

  useEffect(() => {}, []);

  const onSetStoryContext = useCallback(
    (newStoryContext: Partial<IStoryContext>) => {
      (Object.keys(newStoryContext) as Array<keyof IStoryContext>).forEach(
        (key) => {
          const value = newStoryContext[key];
          (defaultValueRef.current[key] as typeof value) = value;
        },
      );
    },
    [defaultValueRef],
  );

  const onUpdateTWStyle = useCallback((params: IUpdateTWStyleParams) => {
    if (!styleRef.current) {
      styleRef.current = document.createElement("style");
      styleRef.current.id = "escharm-story-tw-style";
      if (params.content) {
        styleRef.current.innerHTML = params.content;
      }
      document.head.appendChild(styleRef.current);
    } else {
      if (params.content) {
        styleRef.current.innerHTML = params.content;
      }
    }
  }, []);

  useEffect(() => {
    import.meta.hot?.send("LOAD_STORY_CONTEXT", {
      search: window.location.search,
    });
  }, []);

  useEffect(() => {
    import.meta.hot?.send("INIT_TW_STYLE");
  }, []);

  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.on("SET_STORY_CONTEXT", onSetStoryContext);
      return () => {
        import.meta.hot?.off("SET_STORY_CONTEXT", onSetStoryContext);
      };
    }
  }, [onSetStoryContext]);

  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.on("UPDATE_TW_STYLE", onUpdateTWStyle);
      return () => {
        import.meta.hot?.off("UPDATE_TW_STYLE", onUpdateTWStyle);
      };
    }
  });

  return (
    <StoryContext.Provider value={defaultValueRef.current}>
      {children}
    </StoryContext.Provider>
  );
};

export default StoryProvider;
