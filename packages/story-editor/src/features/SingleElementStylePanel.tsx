import { useHierarchies, useResizers } from "../hierarchy.ts";

interface IProps {
  selectedHierarchyId: string;
}

export const SingleElementStylePanel = (props: IProps) => {
  const { selectedHierarchyId } = props;
  const resizers = useResizers();
  const style = resizers[selectedHierarchyId]?.syncedStyle ?? {};
  const hierarchies = useHierarchies();
  const hierarchy = hierarchies[selectedHierarchyId];
  return (
    <div className="single-element-panel">
      <h4>{hierarchy?.name}</h4>

      <div
        className="style-properties"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: "8px 0",
        }}
      >
        {Object.entries(style).map(([property, value]) => (
          <div
            key={property}
            className="style-property-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderBottom: "1px solid #f0f0f0",
              padding: "4px 0",
              width: "100%", // 修复1：限制行宽
              boxSizing: "border-box",
            }}
          >
            <label
              className="property-name"
              style={{
                minWidth: 80,
                color: "#555",
                fontSize: 14,
              }}
            >
              {property}:
            </label>
            <input
              className="property-input"
              type="text"
              value={value || ""}
              readOnly // 如需可编辑可去掉
              style={{
                flex: 1,
                minWidth: 0, // 修复2：防止input撑开
                padding: "4px 8px",
                border: "1px solid #d9d9d9",
                borderRadius: 4,
                fontSize: 14,
                background: "#fafafa",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
