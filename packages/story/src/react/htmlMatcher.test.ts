import { describe, expect, it, vi } from "vitest";

import { addDataIdToHtmlTags, updateHtmlTagClassNames } from "./htmlMatcher.ts";

// Mock nanoid to return sequential IDs
vi.mock("nanoid", () => {
  let count = 0;
  return {
    nanoid: () => `mock-id-${++count}`,
  };
});

describe("htmlMatcher", () => {
  describe("addDataIdToHtmlTags", () => {
    it("should add data-id attribute to tags without data-id", () => {
      const html = "<div><p>Test</p></div>";
      const result = addDataIdToHtmlTags(html);
      expect(result).toMatchInlineSnapshot(
        `"<div data-id="mock-id-1"><p data-id="mock-id-2">Test</p></div>"`,
      );
    });

    it("should not add data-id to tags that already have it", () => {
      const html =
        '<div name="abc" data-id="existing"><p data-id="existing">Test</p></div>';
      const result = addDataIdToHtmlTags(html);
      expect(result).toMatchInlineSnapshot(
        `"<div name="abc" data-id="existing"><p data-id="existing">Test</p></div>"`,
      );
    });

    it("should handle multi-line HTML correctly", () => {
      const html = `
        <div
          class="container"
          style="color: red;"
        >
          <div
            class="container"
            style="color: red;"
          />
        </div>
      `;
      const result = addDataIdToHtmlTags(html);
      expect(result).toMatchInlineSnapshot(`
        "
                <div
                  data-id="mock-id-3"
                  class="container"
                  style="color: red;"
                >
                  <div
                    data-id="mock-id-4"
                    class="container"
                    style="color: red;"
                  />
                </div>
              "
      `);
    });
  });
});

describe.only("updateHtmlTagClassNames", () => {
  it("should add className when provided", () => {
    const html =
      '<div name="abc" data-id="123" ><p data-id="existing">Test</p></div>';
    const result = updateHtmlTagClassNames(html, "123", "new-class");
    expect(result).toMatchInlineSnapshot(
      `"<div name="abc" data-id="123" className="new-class" ><p data-id="existing">Test</p></div>"`,
    );
  });

  it("should replace className to existing classes", () => {
    const html =
      '<div name="abc" data-id="123" className="existing-class"><p data-id="existing">Test</p></div>';
    const result = updateHtmlTagClassNames(html, "123", "new-class");
    expect(result).toMatchInlineSnapshot(
      `"<div name="abc" data-id="123" className="new-class"><p data-id="existing">Test</p></div>"`,
    );
  });

  it("should replace className if it already exists", () => {
    const html =
      '<div name="abc" data-id="123" className="existing-class new-class"><p data-id="existing">Test</p></div>';
    const result = updateHtmlTagClassNames(html, "123", "new-class");
    expect(result).toMatchInlineSnapshot(
      `"<div name="abc" data-id="123" className="new-class"><p data-id="existing">Test</p></div>"`,
    );
  });

  it("should remove class attribute when className is undefined", () => {
    const html =
      '<div name="abc" data-id="123" className="existing-class"><p data-id="existing">Test</p></div>';
    const result = updateHtmlTagClassNames(html, "123");
    expect(result).toMatchInlineSnapshot(
      `"<div name="abc" data-id="123"><p data-id="existing">Test</p></div>"`,
    );
  });

  it("should remove class attribute when className is empty string", () => {
    const html =
      '<div name="abc" data-id="123" className="existing-class"><p data-id="existing">Test</p></div>';
    const result = updateHtmlTagClassNames(html, "123", "");
    expect(result).toMatchInlineSnapshot(
      `"<div name="abc" data-id="123"><p data-id="existing">Test</p></div>"`,
    );
  });

  it("should handle multiple tags with the same data-id", () => {
    const html =
      `<div data-id="123">
        <span data-id="123">Multiple tags</span>
      </div>`;
    const result = updateHtmlTagClassNames(html, "123", "new-class");
    expect(result).toMatchInlineSnapshot(
      `
      "<div data-id="123" className="new-class">
              <span data-id="123" className="new-class">Multiple tags</span>
            </div>"
    `,
    );
  });

  it("should not modify tags with different data-id", () => {
    const html =
      `<div data-id="123">
        <span data-id="456">Different IDs</span>
      </div>`;
    const result = updateHtmlTagClassNames(html, "123", "new-class");
    expect(result).toMatchInlineSnapshot(
      `
      "<div data-id="123" className="new-class">
              <span data-id="456">Different IDs</span>
            </div>"
    `,
    );
  });

  it("should handle multi-line HTML correctly", () => {
    const html = `
      <div
        data-id="123"
        name="test"
      >
        Content
      </div>
    `;
    const result = updateHtmlTagClassNames(html, "123", "new-class");
    expect(result).toMatchInlineSnapshot(`
      "
            <div
              data-id="123"
              name="test" className="new-class"
            >
              Content
            </div>
          "
    `);
  });
});
