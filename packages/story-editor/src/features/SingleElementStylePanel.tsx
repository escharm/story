import { useHierarchies, useResizers } from "../hierarchy";

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

      <div className="style-properties">
        {Object.entries(style).map(([property, value]) => (
          <div key={property} className="style-property">
            <span className="property-name">{property}:</span>
            <span className="property-value">{value || "未设置"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
