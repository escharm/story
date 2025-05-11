import "./App.css";

import Capture from "./features/Capture";
import ComponentTemplate from "./features/ComponentTemplate";
import GroupResizer from "./features/GroupResizer";
import HierarchyPanel from "./features/panel/HierarchyPanel";
import StoryProvider from "./StoryProvider";
import StorySelector from "./features/panel/StorySelector";
import StylePanel from "./features/panel/StylePanel";
import ContainerPanel from "./features/panel/ContainerPanel";
import TopToolbar from "./features/Toolbar/TopToolbar";
import BottomToolbar from "./features/Toolbar/BottomToolbar";

const App = () => {
  return (
    <StoryProvider>
      <TopToolbar />
      <BottomToolbar />
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
