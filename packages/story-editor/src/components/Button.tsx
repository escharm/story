import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "flat";
  size?: "small" | "medium" | "large";
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "flat",
  size = "medium",
  disabled = false,
  ...props
}) => {
  // 基础样式
  const baseStyle = {
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    fontWeight: 500,
  };

  // 变体样式
  const variantStyles = {
    primary: {
      backgroundColor: "#1677ff",
      color: "#fff",
    },
    secondary: {
      backgroundColor: "#ffffff",
      color: "#333",
      border: "1px solid #d9d9d9",
    },
    flat: {
      backgroundColor: "#f0f0f0",
      color: "#333",
      boxShadow: "none",
    },
  };

  // 尺寸样式
  const sizeStyles = {
    small: {
      padding: "4px 12px",
      fontSize: "12px",
    },
    medium: {
      padding: "8px 16px",
      fontSize: "14px",
    },
    large: {
      padding: "10px 20px",
      fontSize: "16px",
    },
  };

  // 合并样式
  const style = {
    ...baseStyle,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(disabled
      ? {
          backgroundColor: "#f5f5f5",
          color: "#bfbfbf",
          cursor: "not-allowed",
          border: "1px solid #e0e0e0",
          opacity: 0.7,
        }
      : {}),
    ...props.style,
  };

  return (
    <button {...props} style={style} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
