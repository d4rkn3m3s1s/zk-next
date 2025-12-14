import Groq from "groq-sdk";

import "dotenv/config"; // Ensure .env is loaded
const apiKey = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey });

async function main() {
  try {
    console.log("Testing Groq Connection...");
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: "Hello" }],
      model: "llama-3.3-70b-versatile",
    });
    console.log("Success! Response:", chatCompletion.choices[0]?.message?.content);
  } catch (error) {
    console.error("Error connecting to Groq:", error);
  }
}

main();
