import React, { useState } from 'react'
import Calendar from './calendar'
import Chatbot from './chatbot'

export interface TimeBlock {
  task: string;
  start: string; // ISO 8601 format: "YYYY-MM-DDTHH:MM:SSZ"
  end: string;   // ISO 8601 format: "YYYY-MM-DDTHH:MM:SSZ"
}

export interface Schedule {
  user: string;
  blocks: TimeBlock[];
}

const initialSchedule: Schedule = {
  user: "user1",
  blocks: [
    {
      task: "Morning Meeting",
      start: "2024-10-15T02:00:00-07:00",
      end: "2024-10-15T03:00:00-07:00"
    },
    {
      task: "Project Discussion",
      start: "2024-10-16T04:00:00-07:00",
      end: "2024-10-16T05:00:00-07:00"
    },
    {
      task: "Code Review",
      start: "2024-10-17T07:00:00-07:00",
      end: "2024-10-17T08:00:00-07:00"
    },
    {
      task: "Team Sync",
      start: "2024-10-18T09:00:00-07:00",
      end: "2024-10-18T10:00:00-07:00"
    },
    {
      task: "Weekly Planning",
      start: "2024-10-19T03:00:00-07:00",
      end: "2024-10-19T04:00:00-07:00"
    },
    {
      task: "Gym Session",
      start: "2024-10-20T03:00:00-07:00",
      end: "2024-10-20T04:00:00-07:00"
    },
    {
      task: "Church",
      start: "2024-10-21T03:00:00-07:00",
      end: "2024-10-21T04:00:00-07:00"
    },
  ]
};

const homepage = () => {
  const [currentSchedule, setCurrentSchedule] = useState<Schedule>(initialSchedule);

  return (
    <>
      <div className="flex flex-row h-screen">
        <div className="flex-grow lg:flex-grow-4 p-4 overflow-auto scrollbar">
          <Calendar currentSchedule={currentSchedule} setCurrentSchedule={setCurrentSchedule}/>
        </div>
        <div className="flex-grow-5 lg:flex-grow-1 p-4 overflow-auto scrollbar">
          <Chatbot currentSchedule={currentSchedule} setCurrentSchedule={setCurrentSchedule}/>
        </div>
      </div>
    </>
  )
}

export default homepage