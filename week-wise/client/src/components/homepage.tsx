import React, { useState } from 'react'
import Calendar from './calendar'
// import CalendarNew from './calendarNew'
// import Chatbot from './chatbot'
import TodoList from './todo-list'
// import DraggableList from './ui/draggable-list'
import DragCalendar from './ui/draggable-calendar'


import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import Nav from './nav'

export interface TimeBlock {
  id: number;
  task: string;
  start: string; // ISO 8601 format: "YYYY-MM-DDTHH:MM:SSZ"
  end: string;   // ISO 8601 format: "YYYY-MM-DDTHH:MM:SSZ"
  priority?: "low" | "medium" | "high";
}

export interface Schedule {
  user: string;
  blocks: TimeBlock[];
}   

const initialSchedule: Schedule = {
  user: "user1",
  blocks: [
    {
      id: 1,
      task: "Morning Meeting",
      start: "2024-10-26T17:45:00.000Z",
      end: "2024-10-26T18:45:00.000Z",
    },
    {
      id: 9,
      task: "Study",
      start: "2024-10-27T18:45:00.000Z",
      end: "2024-10-27T19:45:00.000Z",
    },
    {
      id: 2,
      task: "Project Discussion",
      start: "2024-10-28T17:45:00.000Z",
      end: "2024-10-28T18:45:00.000Z",
    },
    {
      id: 3,
      task: "Code Review",
      start: "2024-10-29T17:45:00.000Z",
      end: "2024-10-29T18:45:00.000Z",
    },
    {
      id: 4,
      task: "Team Sync",
      start: "2024-10-30T17:45:00.000Z",
      end: "2024-10-30T18:45:00.000Z",
    },
    {
      id: 5,
      task: "Weekly Planning",
      start: "2024-10-31T17:45:00.000Z",
      end: "2024-10-31T18:45:00.000Z",
    },
    {
      id: 6,
      task: "Gym Session",
      start: "2024-10-1T20:45:00.000Z",
      end: "2024-10-1T21:45:00.000Z",
    },
    {
      id: 7,
      task: "Church",
      start: "2024-11-1T13:00:00.000Z",
      end: "2024-11-1T14:00:00.000Z",
    },
    {
      id: 8,
      task: "Code",
      start: "2024-10-23T18:45:00.000Z",
      end: "2024-10-23T20:00:00.000Z",
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
              <div className="h-full px-6 pb-6 scrollbar">
                <Calendar currentSchedule={currentSchedule} setCurrentSchedule={setCurrentSchedule}/>
                {/* <DragCalendar /> */}
              </div>
                  {/* <div className="App min-h-screen bg-gray-100 flex items-center justify-center"> */}
                {/* </div> */}
            </ResizablePanel>
            {/* <ResizableHandle /> */}
            <ResizablePanel defaultSize={25} minSize={25} maxSize={25}>
              <div className="flex h-full items-center justify-center p-6 scrollbar w-full">
                {/* <div className="min-h-screen flex items-center justify-center bg-gray-100"> */}
                  <TodoList currentSchedule={currentSchedule} setCurrentSchedule={setCurrentSchedule}/>
                  {/* <TodoList /> */}
                {/* </div> */}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  )
}

export default homepage