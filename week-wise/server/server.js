import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

// Configure OpenAI API client
const openai = new OpenAI({
  apiKey: `${process.env.OPENAI_API_KEY}`,
});

// ChatGPT endpoint
app.post("/chatbot", async (req, res) => {
  const { message } = req.body;
  console.log("message", message);
  
  const model = "gpt-3.5-turbo";  // Hardcoded model
  const max_tokens = 4000;
  const temperature = 0.5;

  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: message}],
      model: model,
      // max_tokens,
      // temperature,
    });

    console.log('response', response);
    console.log('response', response.choices[0]);
    console.log('response', response.choices[0].message);
    console.log('response', response.choices[0].message.content);
    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error('Error communicating with the API:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
