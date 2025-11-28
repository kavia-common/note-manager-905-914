import React from "react";
import { classNames } from "../../lib/classnames";
import "./Modal.css";

/**
 * PUBLIC_INTERFACE
 * Ocean-themed modal dialog.
 * @param {object} props
 * @param {boolean} props.open
 * @param {Function} props.onClose
 * @param {string} props.className
 * @param {JSX.Element|JSX.Element[]} props.children
 */
export function Modal({ open, onClose, className, children }) {
  if (!open) return null;
  return (
    <div className="ui-modal-backdrop" onClick={onClose}>
      <div className={classNames("ui-modal", className)} onClick={e => e.stopPropagation()}>
        {children}
        <button className="ui-modal-close" onClick={onClose} aria-label="Close Modal">×</button>
      </div>
    </div>
  );
}
