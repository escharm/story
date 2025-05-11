import Toolbar from ".";
import { useSketchpadMode, useToggleSketchpadMode } from "../../store";

const TopToolbar = () => {
  const sketchpadMode = useSketchpadMode();
  const toggleSketchpadMode = useToggleSketchpadMode();
  
  return (
    <Toolbar position="top">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <h4 style={{ margin: 0, fontWeight: 500, fontSize: 15 }}>画板模式</h4>
        <input
          type="checkbox"
          checked={sketchpadMode}
          name=""
          id=""
          onChange={() => {
            toggleSketchpadMode();
          }}
          style={{ margin: 0 }}
        />
      </div>
    </Toolbar>
  );
};

export default TopToolbar;
