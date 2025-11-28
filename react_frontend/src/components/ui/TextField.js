import React from "react";
import "./TextField.css";

/**
 * PUBLIC_INTERFACE
 * Ocean-themed input field.
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.value
 * @param {Function} props.onChange
 * @param {string} props.className
 */
export function TextField({ label, value, onChange, className, ...props }) {
  return (
    <div className={`ui-textfield-group ${className || ""}`}>
      {label && <label className="ui-textfield-label">{label}</label>}
      <input
        type="text"
        className="ui-textfield-input"
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}
