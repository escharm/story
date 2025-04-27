export interface IFlatStructure<T = unknown> {
  [id: string]: T | undefined;
}

export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IHierarchy {
  id: string;
  name: string;
  childIds: string[];
  parentId: string | null;
}

export interface IFlatHierarchy extends IFlatStructure<IHierarchy> {}

export interface IGroup {
  selectedHierarchyIds: string[];
  selectedRects: IFlatStructure<IRect>;
  syncedRect: IRect | null;
}

export interface IStory {
  name: string;
  data: Record<string, unknown>;
}

export interface IFixture {
  stories: Record<string, IStory | undefined>;
}

export interface IPluginParams {
  staticPath?: { prefix: string };
  previewPath?: { prefix: string };
  storyPath?: { prefix: string; test: RegExp };
  fixturesPath?: (path: string) => string;
  homeTemplate?: () => string;
  tailwindCSS?: string;
}

export interface ISaveHierarchyParams {
  searchId?: string;
  hierarchy?: IHierarchy;
}

export interface IResizer {
  id: string;
  originNode?: Node | null;
  syncedRect?: IRect | null;
  syncedStyle?: Record<string, string> | null;
}

export interface IStoryContext {
  data?: Record<string, unknown>;
  hierarchies: IFlatHierarchy;
  resizers: IFlatStructure<IResizer>;
  group: IGroup;
  storyNames: string[];
  styledContainer: {
    needed?: boolean;
    height?: number;
    width?: number;
  };
}

export interface IUpdateTWStyleParams {
  content: string | false;
}

export interface IStyleConfig {
  sketchpadMode?: boolean;
}
