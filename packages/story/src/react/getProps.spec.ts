import { describe, expect, it } from "vitest";

import { getProps } from "./getProps.ts";

describe("getInterfaceProps ast test", () => {
  it("interface + arrow function", () => {
    const result = getProps(`
      interface IProps {
        a: string;
        b: string;
      }
      export const d = (x: IProps) => {};
      export default d;`);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "key": "a",
          "type": "TSStringKeyword",
        },
        {
          "key": "b",
          "type": "TSStringKeyword",
        },
      ]
    `);
  });

  it("interface + default arrow function", () => {
    const result = getProps(`
      interface IProps {
        a: string;
        b: string;
      }
      export default (x: IProps) => {};`);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "key": "a",
          "type": "TSStringKeyword",
        },
        {
          "key": "b",
          "type": "TSStringKeyword",
        },
      ]
    `);
  });

  it("interface + function", () => {
    const result = getProps(`
      interface IProps {
        a: string;
        b: string;
      }
      export function d(x: IProps) {}
      export default d;`);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "key": "a",
          "type": "TSStringKeyword",
        },
        {
          "key": "b",
          "type": "TSStringKeyword",
        },
      ]
    `);
  });

  it("interface + default function", () => {
    const result = getProps(`
      interface IProps {
        a: string;
        b: string;
      }

      export default function d(x: IProps) {}`);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "key": "a",
          "type": "TSStringKeyword",
        },
        {
          "key": "b",
          "type": "TSStringKeyword",
        },
      ]
    `);
  });

  it("type + arrow function", () => {
    const result = getProps(`
      type IProps = {
        a: string;
        b: string;
      };
      export const d = (x: IProps) => {};
      export default d;`);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "key": "a",
          "type": "TSStringKeyword",
        },
        {
          "key": "b",
          "type": "TSStringKeyword",
        },
      ]
    `);
  });

  it("type + default arrow function", () => {
    const result = getProps(`
      type IProps = {
        a: string;
        b: string;
      };
      export default (x: IProps) => {};`);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "key": "a",
          "type": "TSStringKeyword",
        },
        {
          "key": "b",
          "type": "TSStringKeyword",
        },
      ]
    `);
  });

  it("type + function", () => {
    const result = getProps(`
      type IProps = {
        a:string
        b:string
      };
      export function d(x: IProps) {}
      export default d;`);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "key": "a",
          "type": "TSStringKeyword",
        },
        {
          "key": "b",
          "type": "TSStringKeyword",
        },
      ]
    `);
  });

  it("type + default function", () => {
    const result = getProps(`
      type IProps = {
        a:string
        b:string
      };
      export default function d(x: IProps) {}`);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "key": "a",
          "type": "TSStringKeyword",
        },
        {
          "key": "b",
          "type": "TSStringKeyword",
        },
      ]
    `);
  });
});

describe("getInterfaceProps ast test", () => {
  it("interface + arrow function", () => {
    const result = getProps(`
      interface IProps {
        a: string;
        b: string;
        c: {
          c1: string;
        }
      }
      export const d = (x: IProps) => {};
      export default d;`);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "key": "a",
          "type": "TSStringKeyword",
        },
        {
          "key": "b",
          "type": "TSStringKeyword",
        },
        {
          "key": "c",
          "type": "TSTypeLiteral",
        },
      ]
    `);
  });
});



describe("getInterfaceProps component test", () => {
  it("interface + arrow function", () => {
    const result = getProps(`
      interface IProps {
        a: string;
      }

      const Test = (props: IProps) => {
        const { a } = props;
        return <div>{a}</div>;
      };

      export default Test;`);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "key": "a",
          "type": "TSStringKeyword",
        },
      ]
    `);
  });
});
