import { useState } from "react";
import "../design.css";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const expenseTypes = [
    "Food",
    "Entertainment",
    "Transport",
    "Shopping",
    "Bills",
    "Health",
    "Miscellaneous",
];

function TransactionForm({ onSuccess }) {
    const [category, setCategory] = useState(expenseTypes[0]);
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        const parsedAmount = parseFloat(amount);
        if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
            setError("Enter a valid amount greater than 0.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/transactions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    category,
                    amount: parsedAmount,
                    description,
                }),
            });

            if (!response.ok) {
                throw new Error("Unable to save transaction.");
            }

            setMessage("Transaction saved successfully.");
            setAmount("");
            setDescription("");
            onSuccess?.();
        } catch (err) {
            console.error(err);
            setError("Unable to save transaction. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="glass-card transaction-card">
            <h2>📥 Add a Transaction</h2>
            <form className="transaction-form" onSubmit={handleSubmit}>
                <label>
                    Expense Type
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        {expenseTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Amount (INR)
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={amount}
                        placeholder="Enter amount"
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Description
                    <input
                        type="text"
                        value={description}
                        placeholder="Optional note"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>

                <button type="submit" disabled={loading} className="primary-button">
                    {loading ? "Saving..." : "Add Transaction"}
                </button>

                {message && <p className="success-text">{message}</p>}
                {error && <p className="error-text">{error}</p>}
            </form>
        </div>
    );
}

export default TransactionForm;
