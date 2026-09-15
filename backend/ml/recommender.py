#!/usr/bin/env python3
"""
TwinBloom Python ML Layer — Content-Based Recommendation Engine
Calculates Age Match, Interest Match, Strength Match, Performance Match, and Engagement Match.
Returns explainable scores and human-readable pedagogical reasons.
"""

import sys
import json
import math

def calculate_age_match(child_age, rec_age_range):
    """
    Score how well the activity's recommended age aligns with the child's age.
    rec_age_range: [min_age, max_age]
    """
    min_age, max_age = rec_age_range
    if min_age <= child_age <= max_age:
        return 1.0
    diff = min(abs(child_age - min_age), abs(child_age - max_age))
    return max(0.2, 1.0 - (diff * 0.25))

def calculate_set_overlap(list_a, list_b):
    """Calculate Jaccard-like normalized overlap between two string sets."""
    set_a = set([str(x).strip().lower() for x in list_a if x])
    set_b = set([str(x).strip().lower() for x in list_b if x])
    if not set_a or not set_b:
        return 0.2
    intersection = set_a.intersection(set_b)
    if not intersection:
        return 0.1
    return len(intersection) / math.sqrt(len(set_a) * len(set_b))

def generate_recommendations(data):
    child = data.get("child", {})
    activities = data.get("activities", [])
    quiz_results = data.get("quiz_results", [])
    sessions = data.get("sessions", [])
    observations = data.get("observations", [])
    game_records = data.get("game_records", [])

    child_age = child.get("age", 7)
    child_interests = child.get("interests", [])
    child_strengths = child.get("strengths", [])
    child_prefs = child.get("learning_preferences", [])

    # Compute category performance from quizzes & activities
    category_scores = {}
    for qr in quiz_results:
        cat = qr.get("category", "").lower()
        score = qr.get("score", 0)
        total = qr.get("total_questions", 1) or 1
        pct = (score / total) * 100
        category_scores.setdefault(cat, []).append(pct)

    avg_cat_perf = {c: sum(vals)/len(vals) for c, vals in category_scores.items()}

    # Check which activities child completed recently
    completed_activity_ids = set([s.get("activity_id") for s in sessions if s.get("completion_status") == "completed"])
    recent_activity_ids = [s.get("activity_id") for s in sessions[-5:]]

    # Check game affinities
    game_categories = [g.get("game_category", "").lower() for g in game_records]

    scored_activities = []

    for act in activities:
        act_id = act.get("id")
        act_title = act.get("title", "")
        act_cat = act.get("category", "").lower()
        act_tags = act.get("tags", [act_cat])
        act_age_range = act.get("recommended_age", [6, 10])

        # 1. Age Match (weight: 0.20)
        age_score = calculate_age_match(child_age, act_age_range)

        # 2. Interest Match (weight: 0.30)
        interest_score = calculate_set_overlap(child_interests, act_tags + [act_cat])

        # 3. Strength & Preference Match (weight: 0.20)
        pref_score = calculate_set_overlap(child_prefs + child_strengths, act.get("pedagogical_styles", ["visual", "interactive", "hands-on"]))

        # 4. Performance Match (weight: 0.15)
        # If child performs well in a category (e.g. 70%+), build on strength. If struggling (e.g. < 50%), recommend introductory.
        cat_perf = avg_cat_perf.get(act_cat, 70.0)
        if cat_perf >= 75:
            perf_score = 0.95
        elif cat_perf >= 60:
            perf_score = 0.85
        else:
            perf_score = 0.70

        # 5. Engagement & Freshness Match (weight: 0.15)
        if act_id in completed_activity_ids:
            freshness_penalty = 0.65  # lower priority if already completed recently
        elif act_id in recent_activity_ids:
            freshness_penalty = 0.50
        else:
            freshness_penalty = 1.0

        # Bonus if game activity signals align
        game_boost = 0.1 if act_cat in game_categories else 0.0

        # Weighted composite score
        total_score = (
            (age_score * 0.20) +
            (interest_score * 0.30) +
            (pref_score * 0.20) +
            (perf_score * 0.15) +
            (freshness_penalty * 0.15) +
            game_boost
        )
        total_score = min(0.99, max(0.40, total_score))

        # Build human-readable pedagogical justification
        reasons = []
        matching_interests = [i for i in child_interests if i.lower() in [t.lower() for t in act_tags + [act_cat]]]
        if matching_interests:
            reasons.append(f"aligns directly with interest in {', '.join(matching_interests)}")
        if cat_perf >= 75:
            reasons.append(f"reinforces strong performance in {act_cat.title()} ({int(cat_perf)}% mastery)")
        if act_cat in game_categories:
            reasons.append(f"bridges recent positive engagement in {act_cat.title()} game challenges")
        if not reasons:
            reasons.append(f"cultivates core skills in {act_cat.title()} designed for ages {act_age_range[0]}–{act_age_range[1]}")

        reason_text = f"Recommended because it {' and '.join(reasons)}."

        scored_activities.append({
            "activity_id": act_id,
            "activity_name": act_title,
            "category": act_cat,
            "score": round(total_score, 2),
            "match_breakdown": {
                "age_match": round(age_score, 2),
                "interest_match": round(interest_score, 2),
                "preference_match": round(pref_score, 2),
                "performance_match": round(perf_score, 2),
                "freshness": round(freshness_penalty, 2)
            },
            "reason": reason_text
        })

    # Sort descending by score
    scored_activities.sort(key=lambda x: x["score"], reverse=True)
    return scored_activities

def main():
    try:
        raw = sys.stdin.read()
        if not raw.strip():
            print(json.dumps({"error": "Empty input"}))
            return
        payload = json.loads(raw)
        recommendations = generate_recommendations(payload)
        print(json.dumps({
            "status": "success",
            "count": len(recommendations),
            "recommendations": recommendations
        }))
    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))

if __name__ == "__main__":
    main()
