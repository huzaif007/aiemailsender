import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const response = await axios.post(
      process.env.GROQ_ENDPOINT,
      {
        model: process.env.GROQ_MODEL || "mixtral-8x7b-32768",
        messages: [
          { role: "system", content: "You are an assistant that writes professional emails." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Groq API response:", response.data);

    // The response data structure might be like OpenAI's:
    const email = response.data?.choices?.[0]?.message?.content || "";

    res.status(200).json({ email: email.trim() });
  } catch (error) {
    console.error("AI generation error:", error.response?.data || error.message);
    res.status(500).json({ error: "AI generation failed" });
  }
}
