import { useState, FormEvent } from 'react';
import React from 'react';
import axios from 'axios';
import '../Chatbot.css';
import { Schedule, TimeBlock } from './homepage';
import pen from '../assets/pen.svg';
import { useDragControls, Reorder } from 'framer-motion';
import { Button } from './ui/button';
import { classNames } from '../lib/utils';
import { profile } from 'console';
import AddToDo from './add-todo';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const statuses = {
  low: 'text-gray-500 bg-gray-100/10',
  medium: 'text-green-400 bg-green-400/10',
  high: 'text-rose-400 bg-rose-400/10',
  // next: 'text-yellow-400 bg-blue-400/10',
}


const verbalStatuses = {
  weekly: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
  now: 'text-green-400 bg-green-400/10 ring-green-400/30',
  later: 'text-rose-400 bg-rose-400/10 ring-rose-400/30',
  next: 'text-yellow-400 bg-yellow-400/10 ring-yellow-400/30',
}

export interface Task {
  id: number;
  task: string;
  estimatedTime: number; // in minutes
  priority: "low" | "medium" | "high";
}

export interface List {
  user: string;
  tasks: Task[];
}   

const list: List = {
  user: "user1",
  tasks: [
    {
      id: 1,
      task: "Start Homework",
      estimatedTime: 60,
      priority: "high",
    }
  ]
};


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
  const [items, setItems] = React.useState(list);
  const controls = useDragControls()
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
  
    <div className="flex flex-col h-full w-full">
      <div className="border border-gray-700 bg-black rounded-md px-4 py-5 sm:px-6 mb-2">
        <h3 className="text-base font-semibold leading-6 text-gray-200 ">Weekly To Do List</h3>
      </div>
  
      <div className="h-full overflow-auto w-full">
        {/* <ul role="list" className="divide-y divide-white/5"> */}
          <Reorder.Group
            axis="y"
            values={items.tasks}
            onReorder={(newOrder: Array<Task>) => {
              let updatedNewOrder: Array<Task> = newOrder.map((task: Task, index) => {
                return task;
              })

              setItems((prevList) => ({ ...prevList, task: updatedNewOrder }))
            }}
            className="flex flex-col space-y-2 w-full"
          >
            {items.tasks.map((task, index) => { 
              // let start = new Date(task.start);
              // let end = new Date(task.end);
              // let taskDuration = (end.getTime() - start.getTime()) / 1000 / 60;
              let taskString = ""
              let taskDuration = task.estimatedTime
              if (taskDuration % 60 === 0) {
                taskDuration =  (task.estimatedTime) / 60
                let hourString = taskDuration > 1 ? "Hours" : "Hour"
                taskString = taskDuration + " " + hourString 
              }  else {
                let hourString = taskDuration > 1 ? "minutes" : "minute"
                taskString = taskDuration + " " + hourString 
              }
              
              return (
                <Reorder.Item 
                  key={task.id}
                  value={task}
                  className="relative flex w-full items-center space-x-4 py-4 bg-[#181818] rounded-md p-2 border border-gray-700 cursor-pointer"
                  // className="bg-blue-500 text-white p-4 rounded shadow-md cursor-pointer"
                  // dragControls={controls}
                >
                  <div className="min-w-0 flex-auto cursor-pointer">
                    <div className="flex items-center gap-x-3">
                   
                      <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                        <div>
                          <div className="flex items-center gap-x-2">
                            {/* <span className="text-gray-400">Task:</span> */}
                            <span className="truncate">{task.task}</span>
                              <div className={classNames(statuses["medium"], 'flex-none rounded-lg p-1')}>
                               <div className="h-2 w-2 rounded-full bg-current" />
                          </div>
                          </div>
                        </div>
                        <div  className="flex gap-x-2">
                       
                        </div>
                      </h2>
                    </div>
                    {/* <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
                      <p className="truncate">{"YOOO"}</p>
                      <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 flex-none fill-gray-300">
                        <circle r={1} cx={1} cy={1} />
                      </svg>
                      <p className="whitespace-nowrap">{"YOOO"}</p>
                    </div> */}
                  </div>
                  <div
                    className={classNames(
                      verbalStatuses["weekly"],
                      'flex-none rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
                    )}
                  >
                      <span className="truncate">{taskString}</span>
                      <span className="absolute inset-0" />
                  </div>
                  <Button variant="ghost" size="icon">
                  <img src={pen} alt="expand" className='h-5' />
                </Button>
                  {/* <ChevronRightIcon aria-hidden="true" className="h-5 w-5 flex-none text-gray-400" /> */}
                </Reorder.Item>
              )
            })}
          </Reorder.Group>
          <div className="relative flex items-center space-x-4 py-4">
       

            {/* <Sheet>
              <SheetTrigger className='w-full'>
                <button
                  type="button"
                  className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-5 text-center hover:border-gray-400 focus:outline-none"
                >
                  <span className=" block text-sm font-semibold text-gray-200">Add To Do</span>
                </button>
              </SheetTrigger>

              <SheetContent>
                <SheetHeader>
                  <SheetTitle>To Do</SheetTitle>
                  <SheetDescription>

                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet> */}
            <AddToDo></AddToDo>
          </div>
        {/* </ul> */}
      </div>
    </div>
  )
};

export default TodoList;




