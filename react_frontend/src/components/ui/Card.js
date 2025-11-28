import React from "react";
import "./Card.css";

/**
 * PUBLIC_INTERFACE
 * Ocean-themed surface card for grouping content.
 * @param {object} props
 * @param {string} props.className
 * @param {JSX.Element|JSX.Element[]} props.children
 */
export function Card({ className, children, ...props }) {
  return (
    <div className={`ui-card ${className || ""}`} {...props}>
      {children}
    </div>
  );
}
