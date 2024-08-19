import React, { useState } from 'react'
import CalendarNew from './calendarNew'
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
  priority?: number;
  type: 'event' | 'task';
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
      start: "2024-10-17T17:45:00.000Z",
      end: "2024-10-17T18:45:00.000Z",
      priority: 1,
      type: 'task',
    },
    {
      id: 9,
      task: "Study",
      start: "2024-10-17T18:45:00.000Z",
      end: "2024-10-17T19:45:00.000Z",
      priority: 2,
      type: 'task',
    },
    {
      id: 2,
      task: "Project Discussion",
      start: "2024-10-12T17:45:00.000Z",
      end: "2024-10-12T18:45:00.000Z",
      priority: 3,
      type: 'task',
    },
    {
      id: 3,
      task: "Code Review",
      start: "2024-10-13T17:45:00.000Z",
      end: "2024-10-13T18:45:00.000Z",
      priority: 4,
      type: 'task',
    },
    {
      id: 4,
      task: "Team Sync",
      start: "2024-10-14T17:45:00.000Z",
      end: "2024-10-14T18:45:00.000Z",
      priority: 5,
      type: 'task'
    },
    {
      id: 5,
      task: "Weekly Planning",
      start: "2024-10-15T17:45:00.000Z",
      end: "2024-10-15T18:45:00.000Z",
      priority: 6,
      type: 'task'
    },
    {
      id: 6,
      task: "Gym Session",
      start: "2024-10-16T17:45:00.000Z",
      end: "2024-10-16T18:45:00.000Z",
      type: 'event'
    },
    {
      id: 7,
      task: "Church",
      start: "2024-10-18T13:00:00.000Z",
      end: "2024-10-18T14:00:00.000Z",
      priority: 7,
      type: 'task'
    },
    {
      id: 8,
      task: "Code",
      start: "2024-10-18T18:00:00.000Z",
      end: "2024-10-18T19:00:00.000Z",
      priority: 8,
      type: 'task'
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
                <CalendarNew currentSchedule={currentSchedule} setCurrentSchedule={setCurrentSchedule}/>
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