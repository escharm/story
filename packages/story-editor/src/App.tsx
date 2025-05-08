import "./App.css";

import Capture from "./features/Capture.tsx";
import ComponentTemplate from "./features/ComponentTemplate.tsx";
import GroupResizer from "./features/GroupResizer.tsx";
import HierarchyPanel from "./features/panel/HierarchyPanel.tsx";
import StoryProvider from "./StoryProvider.tsx";
import StorySelector from "./features/panel/StorySelector.tsx";
import StylePanel from "./features/panel/StylePanel.tsx";
import ContainerPanel from "./features/panel/ContainerPanel.tsx";
import { Suspense } from "react";

const App = () => {
  return (
    <StoryProvider>
      <HierarchyPanel />
      <StorySelector />
      <StylePanel />
      <ContainerPanel />
      <Capture>
        <ComponentTemplate />
        <Suspense fallback={<p>⌛Downloading message...</p>}></Suspense>
      </Capture>
      <GroupResizer />
    </StoryProvider>
  );
};

export default App;
