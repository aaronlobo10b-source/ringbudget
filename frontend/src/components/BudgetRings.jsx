import { useEffect, useState } from "react";

function BudgetRings() {


    const colors = [
        "#FF3B30", // Red
        "#34C759", // Green
        "#0A84FF", // Blue
        "#FF9500", // Orange
        "#AF52DE"  // Purple
    ];
    const [categories, setCategories] = useState({});

    useEffect(() => {

        loadCategories();

    }, []);

    async function loadCategories() {

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/categories"
            );

            const data = await response.json();

            setCategories(data);

        }

        catch (error) {

            console.error(error);

        }

    }

    return (

        <div className="rings-container">

            {Object.entries(categories).map(

                ([name, data], index) => {
                    const color = colors[index % colors.length];

                    const radius = 60;

                    const stroke = 10;

                    const circumference =
                        2 * Math.PI * radius;

                    const progress = Math.min(
                        data.percentage,
                        100
                    );

                    const offset =
                        circumference -
                        (progress / 100) *
                        circumference;

                    return (

                        <div
                            className="ring-card"
                            key={name}
                        >

                            <svg
                                width="150"
                                height="150"
                            >

                                <circle
                                    cx="75"
                                    cy="75"
                                    r={radius}
                                    stroke="#E5E7EB"
                                    strokeWidth={stroke}
                                    fill="none"
                                />

                                <circle
                                    cx="75"
                                    cy="75"
                                    r={radius}
                                    stroke={color}
                                    strokeWidth={stroke}
                                    fill="none"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={offset}
                                    strokeLinecap="round"
                                    transform="rotate(-90 75 75)"
                                />

                                <text
                                    x="75"
                                    y="80"
                                    textAnchor="middle"
                                    fontSize="18"
                                    fontWeight="bold"
                                >

                                    {Math.round(progress)}%

                                </text>

                            </svg>

                            <h3>{name}</h3>

                            <p>

                                ₹{data.spent.toFixed(2)}

                                {" / "}

                                ₹{data.allocated.toFixed(2)}

                            </p>

                        </div>

                    );

                }

            )}

        </div>

    );

}

export default BudgetRings;