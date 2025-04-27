import SubTest from "./SubTest.tsx";

interface IProps {
  a: string;
}

const Test = (props: IProps) => {
  const { a } = props;
  return (
    <div data-id="fsPaj5-kNsf_7i8x5epBh">
      <p data-id="STCk7M0uEPB1LaCSPa8-c"
        className="h-10"
        style={{ height: 100 }}
        onClick={() => {}}
        title="abcd"
      >
        {a}
      </p>
      <button data-id="EroN_y3dPjT4zusNpJ4pn" className="h-20 w-10">Click me</button>
      <div data-id="OQnnN0yu288qLrafAvL9F">
        <span data-id="EA2dX2fKmd8PqOJn1PpJx">Nested content</span>
      </div>
      <SubTest />
    </div>
  );
};

export default Test;
