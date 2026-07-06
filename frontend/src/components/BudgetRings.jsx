import { useEffect, useState } from "react";
import { formatCurrency, toSafeNumber } from "../utils/formatters";
import "../design.css";

// Use environment variable for API URL, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Category emoji mapping
const categoryEmojis = {
    "Food": "🍔",
    "Entertainment": "🎬",
    "Transport": "🚗",
    "Shopping": "🛍️",
    "Bills": "📄",
    "Health": "💊",
    "Miscellaneous": "📦",
};

// Gradient colors for each ring
const gradientColors = [
    { start: "#f472b6", end: "#ec4899" },      // Pink
    { start: "#34d399", end: "#10b981" },      // Green
    { start: "#60a5fa", end: "#3b82f6" },      // Blue
    { start: "#fbbf24", end: "#f59e0b" },      // Amber
    { start: "#a78bfa", end: "#8b5cf6" },      // Purple
    { start: "#22d3ee", end: "#06b6d4" },      // Cyan
    { start: "#fb7185", end: "#f43f5e" },      // Red
];

function BudgetRings({ isLoading }) {
    const [categories, setCategories] = useState({});
    const [error, setError] = useState("");

    useEffect(() => {
        loadCategories();
        // Refresh categories every 30 seconds
        const interval = setInterval(loadCategories, 30000);
        return () => clearInterval(interval);
    }, []);

    async function loadCategories() {
        try {
            const response = await fetch(`${API_URL}/categories`);
            if (!response.ok) {
                throw new Error("Unable to load category data");
            }
            const data = await response.json();
            setCategories(data ?? {});
            setError("");
        } catch (error) {
            console.error(error);
            setError("Unable to load budget categories right now.");
            setCategories({});
        }
    }

    if (isLoading) {
        return (
            <div className="rings-container">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="ring-card">
                        <div className="skeleton-ring loading-skeleton"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="loading-placeholder">
                <h3>📊 Budget Rings</h3>
                <p>{error}</p>
            </div>
        );
    }

    if (!Object.keys(categories).length) {
        return (
            <div className="loading-placeholder">
                <h3>📊 Budget Rings</h3>
                <p>No budget category data available yet. Start tracking your spending!</p>
            </div>
        );
    }

    return (
        <div>
            <h2 style={{ marginBottom: "24px", marginTop: "32px", fontSize: "1.5rem" }}>
                📊 Budget Breakdown
            </h2>
            <div className="rings-container">
                {Object.entries(categories).map(([name, data], index) => {
                    const colors = gradientColors[index % gradientColors.length];
                    const radius = 60;
                    const stroke = 10;
                    const circumference = 2 * Math.PI * radius;
                    const progress = Math.min(
                        toSafeNumber(data?.percentage),
                        100
                    );
                    const offset =
                        circumference -
                        (progress / 100) * circumference;

                    const emoji = categoryEmojis[name] || "💰";

                    return (
                        <div key={name} className="ring-card">
                            {/* SVG Ring with Gradient */}
                            <div className="ring-svg-container">
                                <svg
                                    className="budget-ring"
                                    width="140"
                                    height="140"
                                    viewBox="0 0 140 140"
                                >
                                    <defs>
                                        <linearGradient
                                            id={`gradient-${index}`}
                                            x1="0%"
                                            y1="0%"
                                            x2="100%"
                                            y2="100%"
                                        >
                                            <stop offset="0%" stopColor={colors.start} />
                                            <stop offset="100%" stopColor={colors.end} />
                                        </linearGradient>
                                    </defs>

                                    {/* Background circle */}
                                    <circle
                                        cx="70"
                                        cy="70"
                                        r={radius}
                                        stroke="rgba(255, 255, 255, 0.1)"
                                        strokeWidth={stroke}
                                        fill="none"
                                    />

                                    {/* Progress circle with gradient */}
                                    <circle
                                        cx="70"
                                        cy="70"
                                        r={radius}
                                        stroke={`url(#gradient-${index})`}
                                        strokeWidth={stroke}
                                        fill="none"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={offset}
                                        strokeLinecap="round"
                                        transform="rotate(-90 70 70)"
                                        style={{
                                            transition: "stroke-dashoffset 0.8s ease-out",
                                            filter: `drop-shadow(0 0 8px ${colors.start})`,
                                        }}
                                    />

                                    {/* Percentage text */}
                                    <text
                                        x="70"
                                        y="80"
                                        textAnchor="middle"
                                        fontSize="20"
                                        fontWeight="700"
                                        fill="#f1f5f9"
                                        style={{ pointerEvents: "none" }}
                                    >
                                        {Math.round(progress)}%
                                    </text>
                                </svg>
                            </div>

                            {/* Category info */}
                            <div>
                                <h3 className="ring-category-name">
                                    <span className="ring-category-emoji">{emoji}</span>
                                    {name}
                                </h3>
                                <p className="ring-values">
                                    <span className="ring-values-spent">
                                        {formatCurrency(data?.spent)}
                                    </span>
                                    <span className="ring-values-allocated">
                                        {" / "}{formatCurrency(data?.allocated)}
                                    </span>
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default BudgetRings;