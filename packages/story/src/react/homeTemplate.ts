const homeTemplate = () => {
  return `
    import React from "react";
    import { createRoot } from "react-dom/client";

    import { App } from "@escharm/story-editor";

    const root = createRoot(document.getElementById("root")!);

    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );`;
};

export default homeTemplate;
