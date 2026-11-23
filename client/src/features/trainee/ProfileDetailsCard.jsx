import React from "react";

export function ProfileDetailsCard({ trainee }) {
  return (
    <article className="trainee-card profile-card">
      <div className="card-heading">
        <div>
          <span className="eyebrow">PROFILE</span>
          <h2>My Details</h2>
        </div>
      </div>

      <div className="profile-details">
        <div>
          <span>Email</span>
          <strong>{trainee?.email}</strong>
        </div>
        <div>
          <span>State</span>
          <strong>{trainee?.state || "Not available"}</strong>
        </div>
        <div>
          <span>District</span>
          <strong>{trainee?.district || "Not available"}</strong>
        </div>
        <div>
          <span>Status</span>
          <strong>{trainee?.status}</strong>
        </div>
      </div>
    </article>
  );
}

export default ProfileDetailsCard;
