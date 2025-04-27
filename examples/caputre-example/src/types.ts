import { CSSProperties } from "react";

import TokenList from "./TokenList";

export interface IState<V = unknown> {
  val: V;
}

export interface IHierarchy {
  id: string;
  childIds: string[];
  parentId: string | null;
  rect: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  manualOffset: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  classList: TokenList;
  style: CSSProperties;
}

export interface IHierarchyEditor {
  id: string;
  selected: string[];
}

export interface IFlatHierarchy extends IFlatStructure<IHierarchy> {}

export interface ISelectedRect extends Pick<IHierarchy, "id" | "rect"> {}

export interface IGroupedRect
  extends Pick<IHierarchy, "rect" | "manualOffset" | "style"> {
  selectedHierarchyIds: string[];
  selectedRects: IFlatStructure<ISelectedRect>;
}

export interface IFlatStructure<T = unknown> {
  [id: string]: T | undefined;
}
