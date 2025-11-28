import React from "react";
import { classNames } from "../../lib/classnames";
import "./FAB.css";

/**
 * PUBLIC_INTERFACE
 * Ocean-themed Floating Action Button.
 * @param {object} props
 * @param {string} props.className
 * @param {JSX.Element|string} props.children
 * @param {Function} props.onClick
 */
export function FAB({ className, children, onClick, ...props }) {
  return (
    <button
      className={classNames("ui-fab", className)}
      onClick={onClick}
      {...props}
      aria-label="Add"
    >
      {children || "+"}
    </button>
  );
}
