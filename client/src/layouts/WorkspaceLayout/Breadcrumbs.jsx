import React from "react";
import { Link } from "react-router-dom";

export function Breadcrumbs({ items = [], current, className = "" }) {
  return (
    <nav className={`workspace-breadcrumbs ${className}`} aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {item.href ? (
            <Link to={item.href} className="workspace-breadcrumbs-item">
              {item.label}
            </Link>
          ) : (
            <span className="workspace-breadcrumbs-item">{item.label}</span>
          )}
          <span className="workspace-breadcrumbs-separator">/</span>
        </React.Fragment>
      ))}
      {current && <span className="workspace-breadcrumbs-current">{current}</span>}
    </nav>
  );
}

export default Breadcrumbs;
