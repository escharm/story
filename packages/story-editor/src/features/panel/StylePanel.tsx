import { useSelectedHierarchies } from "../../hierarchy";
import { Panel } from "../../components/Panel";
import { SingleElementStylePanel } from "../SingleElementStylePanel";
import { MultiElementStylePanel } from "../MultiElementStylePanel";
import Button from "../../components/Button";
import { saveHierarchyChange } from "../../utils/saveHierarchyChange";

const StylePanel = () => {
  const selectedHierarchies = useSelectedHierarchies();
  const selectedHierarchy = selectedHierarchies[0];

  return (
    <Panel
      title="样式面板"
      position="right"
      defaultCollapsed={false}
      top={100}
      style={{ width: "256px" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <Button
          onClick={() => {
            console.log(window.location.search);
            saveHierarchyChange({
              searchId: window.location.search,
              hierarchy: selectedHierarchies[0],
            });
          }}
          style={{
            width: "100%",
            marginBottom: 4,
          }}
          disabled={!selectedHierarchy}
        >
          保存
        </Button>
      </div>
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
