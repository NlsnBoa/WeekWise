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


// ChatGPT endpoint
app.post("/schedule", async (req, res) => {
  const { message, currentSchedule } = req.body;

  // Construct the prompt
  const prompt = `
  You are an assistant that helps manage a user's calendar. Based on the user's current schedule, find an appropriate time block for the task they mention. 
  Return the time block in the following JSON format: { "task": "task name", "start": "start time", "end": "end time" }.
  Then provide a reply to the user about the scheduled task.

  Current Schedule: ${JSON.stringify(currentSchedule)}
  User's Task: ${message}
  `;

  // console.log("prompt", prompt);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{role: 'user', content: prompt}],
      max_tokens: 150,
      temperature: 0.7,
    });

    // Split the response into the time block and the assistant's reply
    const responseText = response.choices[0].message.content.trim();
    console.log("responseText", responseText);
    const splitIndex = responseText.indexOf('}') + 1;

    let timeBlock;
    let assistantReply;
    try {
      timeBlock = JSON.parse(responseText.substring(0, splitIndex));
      assistantReply = responseText.substring(splitIndex).trim();
    } catch (error) {
      return res.status(500).json({ error: "Invalid JSON response from GPT-3" });
    }

    res.json({ timeBlock, reply: assistantReply });
  } catch (error) {
    console.error('Error communicating with the API:', error.message);
    res.status(500).json({ error: error.message });
  }
});


// Start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
