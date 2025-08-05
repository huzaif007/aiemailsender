import { useState } from "react";

export default function Home() {
  const [recipients, setRecipients] = useState("");
  const [prompt, setPrompt] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateEmail = async () => {
    setLoading(true);
    setError("");
    setEmail("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate email");
      setEmail(data.email);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const sendEmail = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients, subject: "Generated Email", body: email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send email");
      alert("Email sent successfully!");
      setRecipients("");
      setPrompt("");
      setEmail("");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center px-6">
      <div className="w-full max-w-3xl text-center space-y-6">
        <h1 className="text-5xl font-bold mb-8">AI Email Generator</h1>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-xl font-medium">Recipients</label>
            <input
              type="text"
              placeholder="e.g. user1@example.com, user2@example.com"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-xl font-medium">Email Prompt</label>
            <textarea
              rows={4}
              placeholder="Describe what you want the email to say..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <button
            onClick={generateEmail}
            disabled={!prompt || loading}
            className="w-full py-4 text-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition"
          >
            {loading ? "Generating..." : "Generate Email"}
          </button>

          {error && <p className="text-red-500 text-lg">{error}</p>}

          {email && (
            <>
              <label className="block mt-6 mb-2 text-xl font-medium">
                Generated Email (Editable)
              </label>
              <textarea
                rows={10}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
              />

              <button
                onClick={sendEmail}
                disabled={!recipients || !email || loading}
                className="w-full mt-4 py-4 text-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition"
              >
                {loading ? "Sending..." : "Send Email"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
