import { useEffect, useState } from "react";

import BudgetRings from "./BudgetRings";
import MainChat from "./MainChat";

function Dashboard() {

    const [summary, setSummary] = useState(null);

    useEffect(() => {

        loadSummary();

    }, []);

    async function loadSummary() {

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/today"
            );

            const data = await response.json();

            setSummary(data);

        }

        catch (error) {

            console.error(error);

        }

    }

    if (!summary) {

        return <h2>Loading Dashboard...</h2>;

    }

    return (

        <div className="dashboard">

            <div className="summary-card">

                <h2>Today's Budget</h2>

                <div className="status-card">

                    <h3>Status</h3>

                    <p>
                        <strong>Spent So Far:</strong>
                        ₹{summary.status.spent_so_far.toFixed(2)}
                    </p>

                    <p>
                        <strong>Projected Total:</strong>
                        ₹{summary.status.projected_total.toFixed(2)}
                    </p>

                    <p>
                        <strong>Budget Limit:</strong>
                        ₹{summary.status.budget_limit.toFixed(2)}
                    </p>

                    <p>
                        <strong>Difference:</strong>
                        ₹{summary.status.difference.toFixed(2)}
                    </p>

                </div>

            </div>

            <BudgetRings />

            <MainChat />

        </div>

    );

}

export default Dashboard;