import { PropsWithChildren } from "react";
import Card from "../../components/Card";
import { useStory } from "../../hierarchy";

interface IProps {
  position: "top" | "bottom";
}

const Toolbar = (props: PropsWithChildren<IProps>) => {
  const { children, position } = props;
  const story = useStory();

  if (!story.data) {
    return null;
  }

  return (
    <Card
      style={{
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        ...(position === "top" ? { top: 0 } : { bottom: 0 }),
      }}
    >
      {children}
    </Card>
  );
};

export default Toolbar;
