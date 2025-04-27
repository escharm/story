import { type PropsWithChildren, useContext } from "react";
import { useSnapshot } from "valtio";
import { StoryContext } from "../StoryProvider.tsx";

interface IProps {}

const StyledContainer = (props: PropsWithChildren<IProps>) => {
  const { children } = props;
  const storyProxy = useContext(StoryContext);
  const story = useSnapshot(storyProxy);
  if (!story.styledContainer.needed) {
    return children;
  }
  return (
    <div
      id="escharm-styled-container"
      style={{
        height: story.styledContainer.height,
        width: story.styledContainer.width,
      }}
    >
      {children}
    </div>
  );
};

export default StyledContainer;
