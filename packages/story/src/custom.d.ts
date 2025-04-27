import "valtio";

import type { IStoryContext } from "@escharm/story-editor";
declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
}

import "vite/types/customEvent.d.ts";

declare module "vite/types/customEvent.d.ts" {
  interface CustomEventMap {
    SET_STORY_CONTEXT: Partial<IStoryContext>;
    UPDATE_TW_STYLE: {
      content: string | false;
    };
    INIT_TW_STYLE: void;
  }
}
