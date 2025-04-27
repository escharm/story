import { PropsWithChildren } from "react";

import { IFlatHierarchy, IGroupedRect } from "./types";
import { DataContext } from "./context";

interface IProps {
  value: {
    hierarchyProxy: IFlatHierarchy;
    groupedRectProxy: IGroupedRect;
  };
}

function DataProvider(props: PropsWithChildren<IProps>) {
  const { children, value } = props;

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export default DataProvider;
