import React, { useState } from 'react'
import Calendar from './calendar'
import Chatbot from './chatbot'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import Nav from './nav'

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
      start: "2024-10-22T02:00:00-12:00",
      end: "2024-10-22T03:00:00-12:00"
    },
    {
      task: "Project Discussion",
      start: "2024-10-23T04:00:00-13:00",
      end: "2024-10-23T05:00:00-13:00"
    },
    {
      task: "Code Review",
      start: "2024-10-24T07:00:00-07:00",
      end: "2024-10-24T08:00:00-07:00"
    },
    {
      task: "Team Sync",
      start: "2024-10-25T09:00:00-07:00",
      end: "2024-10-25T10:00:00-07:00"
    },
    {
      task: "Weekly Planning",
      start: "2024-10-26T03:00:00-12:00",
      end: "2024-10-26T04:00:00-12:00"
    },
    {
      task: "Gym Session",
      start: "2024-10-27T03:00:00-22:00",
      end: "2024-10-27T04:00:00-22:00"
    },
    {
      task: "Church",
      start: "2024-10-28T03:00:00-11:00",
      end: "2024-10-28T04:00:00-11:00"
    },
  ]
};

const homepage = () => {
  const [currentSchedule, setCurrentSchedule] = useState<Schedule>(initialSchedule);

  return (
    <>
      {/* <div className="flex flex-row h-screen">
        <div className="flex-grow lg:flex-grow-4 p-4 overflow-auto scrollbar">
          <Calendar currentSchedule={currentSchedule} setCurrentSchedule={setCurrentSchedule}/>
        </div>
        <div className="flex-grow-5 lg:flex-grow-1 p-4 overflow-auto scrollbar">
          <Chatbot currentSchedule={currentSchedule} setCurrentSchedule={setCurrentSchedule}/>
        </div>
      </div> */}

      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={6} minSize={6} maxSize={6}>
          <Nav />
        </ResizablePanel>
        {/* <ResizableHandle /> */}
        <ResizablePanel defaultSize={94}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={75} minSize={75} maxSize={75}>
              <div className="h-full px-6 pb-6">
                <Calendar currentSchedule={currentSchedule} setCurrentSchedule={setCurrentSchedule}/>
              </div>
            </ResizablePanel>
            {/* <ResizableHandle /> */}
            <ResizablePanel defaultSize={25} minSize={25} maxSize={25}>
              <div className="flex h-full items-center justify-center p-6">
                <Chatbot currentSchedule={currentSchedule} setCurrentSchedule={setCurrentSchedule}/>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  )
}

export default homepage