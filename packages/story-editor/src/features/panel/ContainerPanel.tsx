import React, { useContext } from "react";
import { Panel } from "../../components/Panel";
import { StoryContext } from "../../StoryProvider";

const ContainerPanel = () => {
  const storyProxy = useContext(StoryContext);
  return (
    <Panel title="展示容器" position="right" defaultCollapsed={true} top={200}>
      <input
        type="checkbox"
        name=""
        id=""
        onChange={(event) => {
          storyProxy.styledContainer.needed = event.target.checked;
        }}
      />
    </Panel>
  );
};

export default ContainerPanel;
