"""
Budget Tracker Tools

Core financial calculations + database logic
for Gemini Budget Agent.
"""

import calendar
from datetime import datetime

from supabase import create_client
from dotenv import load_dotenv
import os

# ============================================================
# ENV + SUPABASE
# ============================================================

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_PUBLISHABLE_KEY") or os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ============================================================
# DATE HELPERS
# ============================================================

today = datetime.now()

CURRENT_MONTH = today.month
CURRENT_YEAR = today.year
CURRENT_DAY = today.day

TOTAL_DAYS = calendar.monthrange(CURRENT_YEAR, CURRENT_MONTH)[1]
REMAINING_DAYS = TOTAL_DAYS - CURRENT_DAY

# ============================================================
# FETCHERS
# ============================================================

def get_budget():
    res = (
        supabase.table("user_budget")
        .select("*")
        .eq("month", CURRENT_MONTH)
        .eq("year", CURRENT_YEAR)
        .execute()
    )

    return res.data[0] if res.data else None


def get_expenses():
    res = (
        supabase.table("transactions")
        .select("*")
        .eq("month", CURRENT_MONTH)
        .eq("year", CURRENT_YEAR)
        .execute()
    )

    return res.data or []


def get_category_budgets():
    res = (
        supabase.table("budgets")
        .select("*")
        .execute()
    )

    return res.data or []

# ============================================================
# USER INFO
# ============================================================

def monthly_income():
    b = get_budget()
    return float(b["income"]) if b else 0


def savings_goal():
    b = get_budget()
    return float(b["savings_goal"]) if b else 0


def monthly_budget():
    return monthly_income() - savings_goal()

# ============================================================
# EXPENSE CALCULATIONS
# ============================================================

def total_spent():
    return round(
        sum(float(e["amount"]) for e in get_expenses()),
        2
    )


def remaining_budget():
    return round(monthly_budget() - total_spent(), 2)


def get_daily_velocity():
    if CURRENT_DAY == 0:
        return 0
    return round(total_spent() / CURRENT_DAY, 2)


def safe_daily_spend():
    if REMAINING_DAYS <= 0:
        return 0
    return round(remaining_budget() / REMAINING_DAYS, 2)

# ============================================================
# CATEGORY BREAKDOWN (RINGS)
# ============================================================

def get_category_breakdown():
    rings = {}

    for c in get_category_budgets():
        rings[c["category"]] = {
            "allocated": float(c["allocated_budget"]),
            "spent": 0,
            "remaining": float(c["allocated_budget"]),
            "percentage": 0
        }

    for e in get_expenses():
        cat = e["category"]
        if cat in rings:
            rings[cat]["spent"] += float(e["amount"])

    for cat in rings:
        allocated = rings[cat]["allocated"]
        spent = rings[cat]["spent"]

        rings[cat]["remaining"] = max(allocated - spent, 0)

        if allocated > 0:
            rings[cat]["percentage"] = round((spent / allocated) * 100, 1)

    return rings

# ============================================================
# PREDICTION ENGINE
# ============================================================

def predict_month_end():
    projected = get_daily_velocity() * TOTAL_DAYS

    return {
        "spent_so_far": total_spent(),
        "projected_total": round(projected, 2),
        "budget_limit": monthly_budget(),
        "difference": round(monthly_budget() - projected, 2)
    }

# ============================================================
# SUMMARY (USED BY GEMINI + API)
# ============================================================

def get_budget_summary():
    return {
        "income": monthly_income(),
        "monthly_budget": monthly_budget(),
        "savings_goal": savings_goal(),
        "spent": total_spent(),
        "remaining": remaining_budget(),
        "remaining_days": REMAINING_DAYS,
        "daily_velocity": get_daily_velocity(),
        "safe_daily_spend": safe_daily_spend(),
        "prediction": predict_month_end(),
        "categories": get_category_breakdown()
    }

# ============================================================
# WRITES
# ============================================================

def save_user_budget(income: float, savings_goal: float):

    spending_budget = income - savings_goal

    existing = (
        supabase.table("user_budget")
        .select("*")
        .eq("month", CURRENT_MONTH)
        .eq("year", CURRENT_YEAR)
        .execute()
    )

    data = {
        "month": CURRENT_MONTH,
        "year": CURRENT_YEAR,
        "income": income,
        "savings_goal": savings_goal,
        "monthly_budget": spending_budget
    }

    if existing.data:
        supabase.table("user_budget").update(data).eq(
            "month", CURRENT_MONTH).eq("year", CURRENT_YEAR).execute()
    else:
        supabase.table("user_budget").insert(data).execute()

    return True


def add_transaction(category: str, amount: float, description: str = ""):

    supabase.table("transactions").insert({
        "category": category,
        "amount": amount,
        "description": description,
        "month": CURRENT_MONTH,
        "year": CURRENT_YEAR
    }).execute()

    return True


def reset_category_totals():

    categories = get_category_budgets()
    expenses = get_expenses()

    totals = {c["category"]: 0 for c in categories}

    for e in expenses:
        if e["category"] in totals:
            totals[e["category"]] += float(e["amount"])

    for cat, total in totals.items():
        supabase.table("budgets").update({
            "current_spent": total
        }).eq("category", cat).execute()

    return True

# ============================================================
# TODAY DASHBOARD
# ============================================================

def today_summary():
    return {
        "today": CURRENT_DAY,
        "days_left": REMAINING_DAYS,
        "spent": total_spent(),
        "remaining": remaining_budget(),
        "safe_daily_spend": safe_daily_spend(),
        "velocity": get_daily_velocity(),
        "status": predict_month_end()
    }