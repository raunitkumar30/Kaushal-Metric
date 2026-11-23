import React from "react";

export function UserProfile({ displayName, roleLabel, initial, className = "" }) {
  return (
    <div className={`topbar-user ${className}`}>
      <div className="topbar-avatar">{initial}</div>
      <div className="topbar-user-text">
        <strong>{displayName}</strong>
        <span>{roleLabel}</span>
      </div>
    </div>
  );
}

export default UserProfile;
