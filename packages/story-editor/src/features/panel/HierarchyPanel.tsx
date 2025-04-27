import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { useContext, useState } from "react";
import { useSnapshot } from "valtio";

import { IFlatHierarchy, IHierarchy } from "../../types.ts";
import { useSelectedHierarchyIds } from "../../hierarchy.ts";
import { useSelectHierarchy } from "../../hierarchy.ts";
import { StoryContext } from "../../StoryProvider.tsx";
import { Panel } from "../../components/Panel.tsx";

interface IProps {
  item: IHierarchy;
  hierarchy: IFlatHierarchy;
}

const HierarchyItem = (props: IProps) => {
  const { item, hierarchy } = props;
  const selectedIds = useSelectedHierarchyIds();
  const isSelected = selectedIds.includes(item.id);
  const selectHierarchy = useSelectHierarchy();
  const children = Object.values(hierarchy).filter(
    (child) => child?.parentId === item.id,
  ) as IHierarchy[];

  const handleClick = () => {
    selectHierarchy(item.id);
  };

  return (
    <div style={{ marginLeft: "16px" }}>
      <div
        style={{
          backgroundColor: isSelected ? "#e3f2fd" : "transparent",
          padding: "4px 8px",
          borderRadius: "4px",
        }}
        onClick={handleClick}
      >
        {item.name}
      </div>
      {children.map((child) => (
        <HierarchyItem key={child.id} item={child} hierarchy={hierarchy} />
      ))}
    </div>
  );
};

const HierarchyPanel = () => {
  const storyProxy = useContext(StoryContext);
  const story = useSnapshot(storyProxy);
  const hierarchies = story.hierarchies;
  const rootItems = Object.values(hierarchies).filter(
    (item) => item?.parentId === null,
  ) as IHierarchy[];
  const defaultCollapsed = !new URLSearchParams(window.location.search).has(
    "name",
  );

  return (
    <Panel title="层级目录" position="left" defaultCollapsed={defaultCollapsed}>
      {rootItems.map((item) => (
        <HierarchyItem key={item.id} item={item} hierarchy={hierarchies} />
      ))}
    </Panel>
  );
};

export default HierarchyPanel;
