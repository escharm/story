import React, { PropsWithChildren } from "react";

interface IProps {
  style?: React.CSSProperties;
}

const Card = (props: PropsWithChildren<IProps>) => {
  const { children, style } = props;
  const defaultStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    ...style,
  };

  return <div style={defaultStyle}>{children}</div>;
};

export default Card;
