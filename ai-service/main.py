from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional


app = FastAPI(
    title="KaushalMetric Tracker AI",
    description="AI services for KaushalMetric Tracker",
    version="1.0.0"
)


class SkillInput(BaseModel):
    name: str
    target_level: float
    current_level: Optional[float] = None


class SkillGapRequest(BaseModel):
    skills: List[SkillInput]


class RetentionRiskRequest(BaseModel):
    attendance_percentage: float
    assessment_average: float
    skills_with_gaps: int
    total_skills: int


class EmploymentRiskRequest(BaseModel):
    assessment_average: float
    attendance_percentage: float
    skills_with_gaps: int
    total_skills: int
    certified: bool
    employment_status: str


@app.get("/")
def root():
    return {
        "service": "KaushalMetric Tracker AI",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# ============================================================
# SKILL GAP ANALYSIS
# ============================================================

@app.post("/skill-gap")
def detect_skill_gap(request: SkillGapRequest):
    results = []

    for skill in request.skills:

        # No assessment means the skill has not been assessed.
        if skill.current_level is None:
            results.append({
                "skill": skill.name,
                "target_level": skill.target_level,
                "current_level": None,
                "gap": None,
                "priority": "ASSESSMENT_REQUIRED",
                "explanation": (
                    f"No assessment has been recorded for "
                    f"{skill.name}."
                ),
                "recommendation": (
                    f"Assess {skill.name} before determining "
                    "the trainee's skill gap."
                )
            })

            continue

        gap = max(
            skill.target_level - skill.current_level,
            0
        )

        if gap >= 30:
            priority = "HIGH"
            recommendation = (
                f"Prioritize {skill.name} with focused "
                "practical training and reassess the "
                "skill after the intervention."
            )
        elif gap >= 15:
            priority = "MEDIUM"
            recommendation = (
                f"Provide additional practice in "
                f"{skill.name} and monitor the next "
                "assessment."
            )
        else:
            priority = "LOW"
            recommendation = (
                f"{skill.name} is close to the target; "
                "continue regular practice."
            )

        results.append({
            "skill": skill.name,
            "target_level": skill.target_level,
            "current_level": skill.current_level,
            "gap": gap,
            "priority": priority,
            "explanation": (
                f"{skill.name} is {gap:.0f} points below "
                f"the target level."
            ),
            "recommendation": recommendation
        })

    return {
        "skills": results
    }


# ============================================================
# RETENTION / DROPOUT RISK
# ============================================================

@app.post("/retention-risk")
def predict_retention_risk(
    request: RetentionRiskRequest
):
    risk_score = 0
    reasons = []

    if request.attendance_percentage < 60:
        risk_score += 50
        reasons.append(
            "Attendance is below 60%."
        )
    elif request.attendance_percentage < 75:
        risk_score += 25
        reasons.append(
            "Attendance is below the recommended level."
        )

    if request.assessment_average < 40:
        risk_score += 30
        reasons.append(
            "Assessment performance is low."
        )
    elif request.assessment_average < 60:
        risk_score += 15
        reasons.append(
            "Assessment performance needs improvement."
        )

    if request.total_skills > 0:
        gap_ratio = (
            request.skills_with_gaps /
            request.total_skills
        )

        if gap_ratio >= 0.75:
            risk_score += 20
            reasons.append(
                "Most required skills have significant gaps."
            )
        elif gap_ratio >= 0.5:
            risk_score += 10
            reasons.append(
                "Several required skills have significant gaps."
            )

    risk_score = min(risk_score, 100)

    if risk_score >= 60:
        risk_level = "HIGH"
        recommendation = (
            "Contact the trainee, identify barriers to "
            "participation, and provide targeted academic "
            "or mentoring support."
        )
    elif risk_score >= 30:
        risk_level = "MEDIUM"
        recommendation = (
            "Increase monitoring, provide additional "
            "learning support, and review attendance "
            "and assessment progress."
        )
    else:
        risk_level = "LOW"
        recommendation = (
            "Continue regular monitoring and maintain "
            "the current training support."
        )

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "reasons": reasons,
        "recommendation": recommendation
    }


# ============================================================
# EMPLOYMENT / PLACEMENT RISK
# ============================================================

@app.post("/employment-risk")
def predict_employment_risk(
    request: EmploymentRiskRequest
):
    risk_score = 0
    reasons = []

    if request.assessment_average < 40:
        risk_score += 35
        reasons.append(
            "Assessment performance is significantly "
            "below the expected level."
        )
    elif request.assessment_average < 60:
        risk_score += 20
        reasons.append(
            "Assessment performance needs improvement."
        )

    if request.attendance_percentage < 60:
        risk_score += 20
        reasons.append(
            "Low attendance may reduce training "
            "completion and job readiness."
        )
    elif request.attendance_percentage < 75:
        risk_score += 10
        reasons.append(
            "Attendance is below the recommended level."
        )

    if request.total_skills > 0:
        gap_ratio = (
            request.skills_with_gaps /
            request.total_skills
        )

        if gap_ratio >= 0.75:
            risk_score += 30
            reasons.append(
                "Most required program skills have "
                "significant gaps."
            )
        elif gap_ratio >= 0.5:
            risk_score += 15
            reasons.append(
                "Several required program skills have "
                "significant gaps."
            )

    if not request.certified:
        risk_score += 10
        reasons.append(
            "The trainee has not yet received certification."
        )

    if request.employment_status == "UNEMPLOYED":
        risk_score += 10
        reasons.append(
            "No current employment outcome has been recorded."
        )
    elif request.employment_status == "SEEKING":
        risk_score += 15
        reasons.append(
            "The trainee is currently seeking employment."
        )

    risk_score = min(risk_score, 100)

    if risk_score >= 60:
        risk_level = "HIGH"
        recommendation = (
            "Prioritize placement support, strengthen "
            "the largest skill gaps, and connect the "
            "trainee with suitable employers."
        )
    elif risk_score >= 30:
        risk_level = "MEDIUM"
        recommendation = (
            "Provide targeted skill improvement and "
            "placement assistance, then reassess "
            "job readiness."
        )
    else:
        risk_level = "LOW"
        recommendation = (
            "Continue monitoring job readiness and "
            "connect the trainee with suitable "
            "employment opportunities."
        )

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "reasons": reasons,
        "recommendation": recommendation
    }