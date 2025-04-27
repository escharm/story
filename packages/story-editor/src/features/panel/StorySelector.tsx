import React, { useContext } from "react";
import { useSnapshot } from "valtio";

import { StoryContext } from "../../StoryProvider";
import { Panel } from "../../components/Panel";

const StorySelector: React.FC = () => {
  const storyProxy = useContext(StoryContext);
  const story = useSnapshot(storyProxy);
  const { storyNames } = story;
  const defaultCollapsed = new URLSearchParams(window.location.search).has(
    "name",
  );

  return (
    <Panel
      title="故事列表"
      position="right"
      defaultCollapsed={defaultCollapsed}
    >
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {storyNames.map((name) => (
          <li
            key={name}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              cursor: "pointer",
              marginBottom: "4px",
            }}
            onClick={() => {
              const searchParams = new URLSearchParams(window.location.search);
              searchParams.set("name", name);
              window.location.search = decodeURIComponent(
                searchParams.toString(),
              );
            }}
          >
            {name}
          </li>
        ))}
      </ul>
    </Panel>
  );
};

export default StorySelector;
