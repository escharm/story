import "valtio";
import "vite/types/customEvent.d.ts";

import { IStoryContext, IUpdateTWStyleParams } from "./types";
declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
}

declare module "vite/types/customEvent.d.ts" {
  interface CustomEventMap {
    SET_STORY_CONTEXT: Partial<IStoryContext>;
    UPDATE_TW_STYLE: IUpdateTWStyleParams;
    INIT_TW_STYLE: void;
  }
}
