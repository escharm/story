import { useSelectedHierarchies } from "../../hierarchy";
import { Panel } from "../../components/Panel";
import { SingleElementStylePanel } from "../SingleElementStylePanel";
import { MultiElementStylePanel } from "../MultiElementStylePanel";
import Button from "../../components/Button";
import { saveHierarchyChange } from "../../utils/saveHierarchyChange";
import { useSketchpadMode, useToggleSketchpadMode } from "../../store";

const StylePanel = () => {
  const selectedHierarchies = useSelectedHierarchies();
  const selectedHierarchy = selectedHierarchies[0];
  const sketchpadMode = useSketchpadMode();
  const toggleSketchpadMode = useToggleSketchpadMode();
  return (
    <Panel title="样式面板" position="right" defaultCollapsed={false} top={100}>
      {selectedHierarchy && (
        <Button
          onClick={() => {
            console.log(window.location.search);
            saveHierarchyChange({
              searchId: window.location.search,
              hierarchy: selectedHierarchies[0],
            });
          }}
        >
          保存
        </Button>
      )}
      <h4>画板模式</h4>
      <input
        type="checkbox"
        checked={sketchpadMode}
        name=""
        id=""
        onChange={() => {
          toggleSketchpadMode();
        }}
      />
      {selectedHierarchies.length === 0 ? (
        <div>请选择一个元素</div>
      ) : selectedHierarchies.length === 1 ? (
        <SingleElementStylePanel
          selectedHierarchyId={selectedHierarchies[0].id}
        />
      ) : (
        <MultiElementStylePanel hierarchies={selectedHierarchies} />
      )}
    </Panel>
  );
};

export default StylePanel;
