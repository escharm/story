import { describe, expect, it } from "vitest";

import homeTemplate from "./homeTemplate";

describe("homeTemplate", () => {
  it("should generate correct template with mock data", () => {
    const result = homeTemplate();
    expect(result.trim()).toMatchInlineSnapshot(`
      "import React from "react";
          import { createRoot } from "react-dom/client";

          import App from "/src/components/App";

          const root = createRoot(document.getElementById("root")!);

          root.render(
            <React.StrictMode>
              <App />
            </React.StrictMode>,
          );"
    `);
  });
});
