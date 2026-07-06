import { useEffect, useState } from "react";
import BudgetRings from "./BudgetRings";
import MainChat from "./MainChat";
import { formatCurrency, toSafeNumber } from "../utils/formatters";
import "../design.css";

function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSummary();
        // Refresh summary every 30 seconds
        const interval = setInterval(loadSummary, 30000);
        return () => clearInterval(interval);
    }, []);

    async function loadSummary() {
        try {
            const response = await fetch("http://127.0.0.1:8000/today");
            if (!response.ok) {
                throw new Error("Unable to load dashboard data");
            }
            const data = await response.json();
            setSummary(data);
            setError("");
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setError("Unable to load dashboard data right now.");
            setSummary(null);
            setIsLoading(false);
        }
    }

    const status = summary?.status ?? {};
    const safeStats = {
        spent: toSafeNumber(status.spent_so_far),
        projected: toSafeNumber(status.projected_total),
        limit: toSafeNumber(status.budget_limit),
        remaining: toSafeNumber(summary?.remaining),
        velocity: toSafeNumber(summary?.velocity),
        safeDailySpend: toSafeNumber(summary?.safe_daily_spend),
    };

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <h1 className="dashboard-title">Budget Buddy</h1>
                <p className="dashboard-subtitle">Your AI-powered spending companion</p>
            </div>

            {/* Summary Cards Section */}
            {isLoading ? (
                <div className="summary-section">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="glass-card skeleton-card loading-skeleton"></div>
                    ))}
                </div>
            ) : error ? (
                <div className="glass-card">
                    <p style={{ color: "#f87171" }}>{error}</p>
                </div>
            ) : (
                <div className="summary-section">
                    {/* Spent So Far */}
                    <div className="glass-card glass-card-sm">
                        <div className="summary-metric">
                            <div className="summary-label">💸 Spent So Far</div>
                            <div className="summary-value">{formatCurrency(safeStats.spent)}</div>
                            <div className="summary-subtext">
                                {safeStats.spent > 0 ? "On pace today" : "No expenses yet"}
                            </div>
                        </div>
                    </div>

                    {/* Budget Limit */}
                    <div className="glass-card glass-card-sm">
                        <div className="summary-metric">
                            <div className="summary-label">🎯 Daily Limit</div>
                            <div className="summary-value">{formatCurrency(safeStats.limit)}</div>
                            <div className="summary-subtext">
                                {safeStats.remaining >= 0 
                                    ? `${formatCurrency(safeStats.remaining)} left` 
                                    : "Over budget!"}
                            </div>
                        </div>
                    </div>

                    {/* Spending Velocity */}
                    <div className="glass-card glass-card-sm">
                        <div className="summary-metric">
                            <div className="summary-label">⚡ Daily Velocity</div>
                            <div className="summary-value">{formatCurrency(safeStats.velocity)}</div>
                            <div className="summary-subtext">Average spend/day</div>
                        </div>
                    </div>

                    {/* Safe Daily Spend */}
                    <div className="glass-card glass-card-sm">
                        <div className="summary-metric">
                            <div className="summary-label">✨ Safe Spend Today</div>
                            <div className="summary-value">{formatCurrency(safeStats.safeDailySpend)}</div>
                            <div className="summary-subtext">Comfortable pace</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Budget Rings Section */}
            <BudgetRings isLoading={isLoading} />

            {/* Chat Section */}
            <div style={{ paddingBottom: "350px" }}>
                <MainChat />
            </div>
        </div>
    );
}

export default Dashboard;