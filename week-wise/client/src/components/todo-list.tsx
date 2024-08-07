import { useState, FormEvent } from 'react';
import React from 'react';
import axios from 'axios';
import '../Chatbot.css';
import { Schedule } from './homepage';
import { motion, Reorder } from 'framer-motion';


const statuses = {
  offline: 'text-gray-500 bg-gray-100/10',
  online: 'text-green-400 bg-green-400/10',
  error: 'text-rose-400 bg-rose-400/10',
}
const environments = {
  Preview: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
  Production: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
}
const deployments = [
  {
    id: 2,
    text: 'Item 1',
    href: '#',
    projectName: 'mobile-api',
    teamName: 'Running',
    status: 'online',
    statusText: 'Deployed 3m ago',
    description: 'Deploys from GitHub',
    environment: 'Production',
  },
  {
    id: 3,
    text: 'Item 2',
    href: '#',
    projectName: 'tailwindcss.com',
    teamName: 'Do homework',
    status: 'offline',
    statusText: 'Deployed 3h ago',
    description: 'Deploys from GitHub',
    environment: 'Preview',
  },
  {
    id: 4,
    text: 'Item 3',
    href: '#',
    projectName: 'api.protocol.chat',
    teamName: 'Play Minecraft',
    status: 'error',
    statusText: 'Failed to deploy 6d ago',
    description: 'Deploys from GitHub',
    environment: 'Preview',
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

interface Message {
  text: string;
  user: boolean;
}


interface TodoListProps {
  currentSchedule: Schedule;
  setCurrentSchedule: React.Dispatch<React.SetStateAction<Schedule>>;
}


const TodoList = ({ currentSchedule, setCurrentSchedule } : TodoListProps ) => {
  const [input, setInput] = useState<string>('');
  const [items, setItems] = React.useState(deployments);
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
      const response = await axios.post('http://localhost:5050/updateSchedule', {
        message: input,
        currentSchedule,
      });
  
      console.log("updatedSchedule", response.data.updatedSchedule);
      console.log("reply", response.data.reply);

      const updatedSchedule: Schedule = response.data.updatedSchedule;
      // Update the schedule with the new time block
      setCurrentSchedule(updatedSchedule);

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
  
    <div className="flex flex-col h-full">
      <div className="border border-gray-700 bg-black rounded-md px-4 py-5 sm:px-6">
        <h3 className="text-base font-semibold leading-6 text-gray-200">To Do List</h3>
      </div>
  
      <div className="h-full overflow-auto">
        {/* <ul role="list" className="divide-y divide-white/5"> */}
          <Reorder.Group
            axis="y"
            values={items}
            onReorder={setItems}
            className="flex flex-col space-y-2 p-4"
          >
            {items.map((deployment) => (
              <Reorder.Item 
                key={deployment.id}
                value={deployment}
                className="relative flex items-center space-x-4 py-4"
                // className="bg-blue-500 text-white p-4 rounded shadow-md cursor-pointer"
              >
                <div className="min-w-0 flex-auto">
                  <div className="flex items-center gap-x-3">
                    <div className={classNames(statuses[deployment.status], 'flex-none rounded-full p-1')}>
                      <div className="h-2 w-2 rounded-full bg-current" />
                    </div>
                    <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                      <a href={deployment.href} className="flex gap-x-2">
                        <span className="truncate">{deployment.teamName}</span>
                        {/* <span className="text-gray-400">/</span> */}
                        {/* <span className="whitespace-nowrap">{deployment.projectName}</span> */}
                        {/* <span className="absolute inset-0" /> */}
                      </a>
                    </h2>
                  </div>
                  <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
                    <p className="truncate">{deployment.description}</p>
                    <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 flex-none fill-gray-300">
                      <circle r={1} cx={1} cy={1} />
                    </svg>
                    <p className="whitespace-nowrap">{deployment.statusText}</p>
                  </div>
                </div>
                <div
                  className={classNames(
                    environments[deployment.environment],
                    'flex-none rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
                  )}
                >
                  {deployment.environment}
                </div>
                {/* <ChevronRightIcon aria-hidden="true" className="h-5 w-5 flex-none text-gray-400" /> */}
              </Reorder.Item>
            ))}
          </Reorder.Group>
          <div className="relative flex items-center space-x-4 py-4">
          <button
            type="button"
            className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-5 text-center hover:border-gray-400 focus:outline-none"
          >
            {/* <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
              aria-hidden="true"
              className="mx-auto h-12 w-12 text-gray-400"
            >
              <path
                d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg> */}
            <span className=" block text-sm font-semibold text-gray-200">Add To Do</span>
          </button>
          </div>
        {/* </ul> */}
      </div>
    </div>
  )
};

export default TodoList;




