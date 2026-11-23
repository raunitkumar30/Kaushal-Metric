import React from "react";

export function PageContainer({ children, className = "" }) {
  return <main className={`workspace-content ${className}`}>{children}</main>;
}

export default PageContainer;
