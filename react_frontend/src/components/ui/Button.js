import React from "react";
import { classNames } from "../../lib/classnames";
import "./Button.css";

/**
 * PUBLIC_INTERFACE
 * Ocean-themed button for consistent UI.
 * @param {object} props - React props
 * @param {'primary'|'secondary'} props.variant
 * @param {string} props.className
 * @param {JSX.Element | string} props.children
 */
export function Button({ variant = "primary", className, children, ...props }) {
  return (
    <button
      className={classNames(
        "ui-btn",
        variant === "primary" ? "ui-btn-primary" : "ui-btn-secondary",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
