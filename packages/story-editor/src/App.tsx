import "./App.css";

import Capture from "./features/Capture.tsx";
import ComponentTemplate from "./features/ComponentTemplate.tsx";
import GroupResizer from "./features/GroupResizer.tsx";
import HierarchyPanel from "./features/panel/HierarchyPanel.tsx";
import StoryProvider from "./StoryProvider.tsx";
import StorySelector from "./features/panel/StorySelector.tsx";
import StylePanel from "./features/panel/StylePanel.tsx";
import ContainerPanel from "./features/panel/ContainerPanel.tsx";

const App = () => {
  return (
    <StoryProvider>
      <HierarchyPanel />
      <StorySelector />
      <StylePanel />
      <ContainerPanel />
      <Capture>
        <ComponentTemplate />
      </Capture>
      <GroupResizer />
    </StoryProvider>
  );
};

export default App;
