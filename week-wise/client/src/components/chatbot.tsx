import { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import '../Chatbot.css';
import WelcomeCard from './welcomeCard'
import { Schedule, TimeBlock } from './homepage';

interface Message {
  text: string;
  user: boolean;
}


interface ChatbotProps {
  currentSchedule: Schedule;
  setCurrentSchedule: React.Dispatch<React.SetStateAction<Schedule>>;
}


const Chatbot = ({ currentSchedule, setCurrentSchedule } : ChatbotProps ) => {
// const Chatbot: React.FC = ( ) => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Start loading spinner
    setLoading(true);

    // Add user message to the chat
    const userMessage: Message = { text: input, user: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    console.log("input", input);
    try {
      // Send the user message to the server
      const response = await axios.post('http://localhost:5050/schedule', {
        message: input,
        currentSchedule,
      });
  
      console.log("TimeBlock", response.data.timeBlock);
      console.log("reply", response.data.reply);

      const newTimeBlock: TimeBlock = response.data.timeBlock;
      // Update the schedule with the new time block
      setCurrentSchedule((prevSchedule: Schedule) => ({
        ...prevSchedule,
        blocks: [...prevSchedule.blocks, newTimeBlock]
      }));

      console.log("currentSchedule", currentSchedule);
      
      // Add the AI response to the chat
      const aiMessage: Message = { text: response.data.reply, user: false };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);

    } catch (error) {
      // Add an error message to the chat
      const errorMessage: Message = { text: "Something is going wrong, Please try again.", user: false };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setLoading(false);
    setInput('');
  };


  return (
    <div className="chatbot-container">
      { messages.length === 0 && 
        <WelcomeCard></WelcomeCard>
      }

      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.user ? 'user-message' : 'ai-message'}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      {loading && <div className='text-white'>Loading...</div>}
      <form className="chatbot-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          placeholder="Ask your assistant..."
        />
        <button type="submit" disabled={loading}>Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
