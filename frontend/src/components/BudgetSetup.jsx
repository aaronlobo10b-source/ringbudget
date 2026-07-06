import { useState } from "react";

function BudgetSetup({ onComplete }) {

    const [income, setIncome] = useState("");

    const [savings, setSavings] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {

        e.preventDefault();

        setLoading(true);

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        message:
                            `My monthly income is ₹${income} and I want to save ₹${savings} every month.`
                    })
                }
            );

            const data = await response.json();

            console.log(data);

            onComplete();

        } catch (err) {

            console.error(err);

            alert("Unable to save budget.");

        } finally {

            setLoading(false);

        }

    }

        return (

        <div className="setup-container">

            <h1>Budget Buddy</h1>

            <h2>Let's set up your monthly budget</h2>

            <form onSubmit={handleSubmit}>

                <label>

                    Monthly Income

                    <input
                        type="number"
                        placeholder="Enter monthly income"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        required
                    />

                </label>

                <label>

                    Monthly Savings Goal

                    <input
                        type="number"
                        placeholder="Enter savings goal"
                        value={savings}
                        onChange={(e) => setSavings(e.target.value)}
                        required
                    />

                </label>

                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Saving..."
                        : "Continue"}

                </button>

            </form>

        </div>

    );

}

export default BudgetSetup;