import { describe, expect, it } from "vitest";

import { parseToHierarchy } from "./parseToHierarchy";

describe("parseToHierarchy", () => {
  it("should parse component to hierarchy", () => {
    const code = `
      interface IProps {
        a: string;
      }

      const Test = (props: IProps) => {
        const { a } = props;
        return (
          <div data-id="Z-dDqMJMPX5qFrRSvmja7">
            <p data-id="3k1u2ohQLaMkRAfl6nRSa">{a}</p>
            <button data-id="SpAxCt61iEVAUiiaEHn16">Click me</button>
            <div data-id="OkUfGQ3ePnt5namfPf4Sv">
              <span data-id="tipv7O_5eLy789VGv7CXN">Nested content</span>
            </div>
          </div>
        );
      };
      
      const ABC = (props: IProps) => {
        const { a } = props;
        return (
          <div data-id="test">
            <p data-id="test2">{a}</p>
            <button data-id="test3">Click me</button>
            <div data-id="test5">
              <span data-id="test5">Nested content</span>
            </div>
          </div>
        );
      };

      export default Test;`;

    const result = parseToHierarchy(code);
    expect(result).toMatchInlineSnapshot(`
      {
        "3k1u2ohQLaMkRAfl6nRSa": {
          "childIds": [],
          "id": "3k1u2ohQLaMkRAfl6nRSa",
          "name": "p",
          "parentId": "Z-dDqMJMPX5qFrRSvmja7",
        },
        "OkUfGQ3ePnt5namfPf4Sv": {
          "childIds": [
            "tipv7O_5eLy789VGv7CXN",
          ],
          "id": "OkUfGQ3ePnt5namfPf4Sv",
          "name": "div",
          "parentId": "Z-dDqMJMPX5qFrRSvmja7",
        },
        "SpAxCt61iEVAUiiaEHn16": {
          "childIds": [],
          "id": "SpAxCt61iEVAUiiaEHn16",
          "name": "button",
          "parentId": "Z-dDqMJMPX5qFrRSvmja7",
        },
        "Z-dDqMJMPX5qFrRSvmja7": {
          "childIds": [
            "3k1u2ohQLaMkRAfl6nRSa",
            "SpAxCt61iEVAUiiaEHn16",
            "OkUfGQ3ePnt5namfPf4Sv",
          ],
          "id": "Z-dDqMJMPX5qFrRSvmja7",
          "name": "div",
          "parentId": null,
        },
        "tipv7O_5eLy789VGv7CXN": {
          "childIds": [],
          "id": "tipv7O_5eLy789VGv7CXN",
          "name": "span",
          "parentId": "OkUfGQ3ePnt5namfPf4Sv",
        },
      }
    `);
  });
});
