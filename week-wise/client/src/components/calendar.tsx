'use client'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, EllipsisHorizontalIcon } from '@heroicons/react/20/solid'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { Schedule, TimeBlock } from './homepage';
import Draggable from 'react-draggable';  // Import Draggable
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Button } from "@/components/ui/button"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import clock from '../assets/clock.svg'
import expand from '../assets/expand.svg'
import { delay } from 'framer-motion';




// These need to exist for tailwind to add the styles to the build
// They are not used in the code but are required for the styles to be added
const TimeBlockStyles = [ "relative mt-px flex sm:col-start-1"
                          ,"relative mt-px flex sm:col-start-2" 
                          ,"relative mt-px flex sm:col-start-3"
                          ,"relative mt-px flex sm:col-start-4"
                          ,"relative mt-px flex sm:col-start-5"
                          ,"relative mt-px flex sm:col-start-6"
                          ,"relative mt-px flex sm:col-start-7" 
                          ,"col-start-1",
                          "col-start-2",
                          "col-start-3",
                          "col-start-4",
                          "col-start-5",
                          "col-start-6",
                          "col-start-7",
                          "col-start-8",  
                          "col-end-1",  
                          "col-end-2",
                          "col-end-3",
                          "col-end-4",
                          "col-end-5",
                          "col-end-6",
                          "col-end-7",
                          "col-end-8",
                        ]

interface CalendarProps {
  currentSchedule: Schedule;
  setCurrentSchedule: React.Dispatch<React.SetStateAction<Schedule>>;
}

const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours(); // 0-23
  const current_time_in_seconds = (now.getMinutes() * 60) + (hours * 60 * 60); // 0-86399
  return current_time_in_seconds;
}

const getWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Set to Monday
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push(date);
  }
  return weekDates;
};

const getDayIndex = () => {
  const now = new Date();
  const weekDates = getWeekDates();
  const MondayDate = weekDates[0].getDate();
  const index = now.getDate() - MondayDate + 1
  return index;
}


const Calendar = ({ currentSchedule, setCurrentSchedule } : CalendarProps) => {
  const container = useRef<HTMLDivElement>(null)
  const containerNav = useRef<HTMLDivElement>(null)
  const containerOffset = useRef<HTMLDivElement>(null)
  const [currentTime, setCurrentTime] = useState<number>(getCurrentTime());
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(getDayIndex());
  // State to track whether an item is currently being dragged
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const threshold = 5; // Define a threshold for distinguishing drag vs. click

  const handleMouseDown = (event) => {
    if (!isPopoverVisible)
      setPopoverVisible(false); // Close the popover

    // Capture the starting position of the mouse
    startPos.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseUp = (event) => {
    // Calculate the distance moved
    const distance = Math.sqrt(
      Math.pow(event.clientX - startPos.current.x, 2) +
      Math.pow(event.clientY - startPos.current.y, 2)
    );

    // Check if the movement is within the threshold
    if (distance < threshold)  {
      setPopoverVisible((prev) => !prev); // Toggle popover visibility
    }
  };

  const gridSize = 28; // Define grid size for snapping

  // Store the last position to calculate the relative drag
  const positionRef = useRef({ y: 0 });

  const handleStart = useCallback((e, data) => {
    // Set the current position as the starting point
    positionRef.current = { y: data.y };
  }, []);

  useEffect(() => {
    // Set the container scroll position based on the current time.
    const currentMinute = new Date().getHours() * 60
    // if (container && container.current && container.current.scrollTop && containerNav && containerNav.current && containerOffset && containerOffset.current && containerOffset.current.offsetHeight) {
      container.current!.scrollTop =
      ((container.current!.scrollHeight - containerNav.current!.offsetHeight - containerOffset.current!.offsetHeight) *
        currentMinute) /
      1440
    // }

  }, [])

  const handleDrag = useCallback((e, data, block: TimeBlock, index: number) => {
    
    console.log('data', data)
    // Calculate the relative y difference from the starting point
    const deltaY = data.y - positionRef.current.y;
    console.log('deltaY', deltaY)

    // Snap to grid: Calculate how many full grid steps have been dragged
    const gridSteps = Math.round(deltaY / (gridSize));

    console.log('gridSteps', gridSteps)
    

    // Only update if there's an actual step movement
    if (gridSteps !== 0) {
      const draggedMinutes = gridSteps * 15; // 15-minute intervals
      console.log('draggedMinutes', draggedMinutes)

      const updatedStart = new Date(block.updatedStart);
      const updatedEnd = new Date(block.updatedEnd);

      console.log('updatedStart before', updatedStart)
      console.log('updatedEnd before', updatedEnd)

      // Update position accurately
      updatedStart.setMinutes(updatedStart.getMinutes() + draggedMinutes);
      updatedEnd.setMinutes(updatedEnd.getMinutes() + draggedMinutes);
      console.log('updatedStart after', updatedStart)
      console.log('updatedEnd after', updatedEnd)

 

      // Create new blocks array
      const updatedBlocks = currentSchedule.blocks.map((b, i) =>
        i === index ? { ...b, updatedStart: updatedStart.toISOString(), updatedEnd: updatedEnd.toISOString() } : b
      );

      // setTimeout(() => {  
      //   setCurrentSchedule((prevSchedule) => ({ ...prevSchedule, blocks: updatedBlocks }));
      // }, 1000)
      // Set the updated schedule
      setCurrentSchedule((prevSchedule) => ({ ...prevSchedule, blocks: updatedBlocks }));

      // Update the reference position
      positionRef.current.y = data.y;
    }
  }, [gridSize, currentSchedule, setCurrentSchedule]);


  const handleStop = useCallback((event) => {
    handleMouseUp(event);
    positionRef.current.y = 0; // Reset position reference
  }, []);


  useEffect(() => {
    const updateCurrentTime = () => {
      let time = getCurrentTime();
      setCurrentTime(time);
    };

    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const weekDates = getWeekDates();

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-none items-center justify-between px-6 py-4">
        <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
          {/* Week Wise */}
        </h2>
        <div className="flex items-center">
          {/* <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
            >
              <span className="sr-only">Previous week</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
            >
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
            >
              <span className="sr-only">Next week</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div> */}
          <div className="hidden md:ml-4 md:flex md:items-center">
            
            <div className="mx-6 h-6 w-px bg-gray-300" />
            <Menu as="div" className="relative">
              <MenuButton
                type="button"
                className="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Week view
                <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <div className="py-1">
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                    >
                      Day view
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                    >
                      Week view
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                    >
                      Month view
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                    >
                      Year view
                    </a>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
            <div className="ml-6 h-6 w-px bg-gray-300" />
            <button
              type="button"
              className="ml-6 rounded-md border-[1px] border-[#303030] bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Add event
            </button>
            
          </div>
          <Menu as="div" className="relative ml-6 md:hidden">
            <MenuButton className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Open menu</span>
              <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
            </MenuButton>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  >
                    Create event
                  </a>
                </MenuItem>
              </div>
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  >
                    Go to today
                  </a>
                </MenuItem>
              </div>
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  >
                    Day view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  >
                    Week view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  >
                    Month view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  >
                    Year view
                  </a>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </header>
      <div ref={container} className="isolate flex flex-auto flex-col overflow-auto bg-black rounded-2xl border-8 border-black">
        <div style={{ width: '165%' }} className="flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full">
          <div
            ref={containerNav}
            className="sticky top-0 z-30 flex-none bg-black border-b-[1px] border-white ring-white ring-opacity-5 sm:pr-8"
          >
            <div className="-mr-px hidden grid-cols-7 divide-x divide-gray-500 border-r border-gray-500 text-sm leading-6 text-white sm:grid">
              <div className="col-end-1 w-14" />
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={index} className="flex items-center justify-center py-3">
                  <span className={` ${currentDayIndex - 1 == index ? 'flex items-baseline text-blue-500' : ''}`}>
                    {day}{' '}
                    <span className={`${currentDayIndex - 1 == index ? 'ml-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-semibold text-white' : 'items-center justify-center font-semibold text-white '}`}>
                      {weekDates[index].getDate()}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-auto">
            <div className="sticky left-0 z-10 w-14 flex-none bg-black ring-1 ring-black" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Horizontal lines */}
              <div
                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-500"
                style={{ gridTemplateRows: 'repeat(48, minmax(3.5rem, 1fr))' }}
              >
                <div ref={containerOffset} className="row-end-1 h-7"></div>
                {[...Array(24).keys()].map((hour) => (
                  <Fragment key={`frag-${hour}`}>
                    <div key={`time-${hour}`}>
                      <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                        {hour % 12 === 0 ? 12 : hour % 12}{hour < 12 ? 'AM' : 'PM'}
                      </div>
                    </div>
                    <div key={`spacer-${hour}`} />
                  </Fragment>
                ))}
              </div>

              {/* Vertical lines */}
              <div className="col-start-1 col-end-2 row-start-1 hidden grid-cols-7 grid-rows-1 divide-x divide-gray-500 sm:grid sm:grid-cols-7">
                {[...Array(7).keys()].map((day) => (
                  <div key={day} className={`col-start-${day + 1} row-span-full`} />
                ))}
                <div className="col-start-8 row-span-full w-8" />
              </div>

              {/* Events */}
              {/* <ol
                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
                style={{ gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto' }}
              >
                <li className="relative mt-px flex sm:col-start-3" style={{ gridRow: '74 / span 12' }}>
                  <a
                    href="#"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-800 p-2 text-xs leading-5 hover:bg-blue-900"
                  >
                    <p className="order-1 font-semibold text-white">Breakfast</p>
                    <p className="text-blue-200 group-hover:text-blue-100">
                      <time dateTime="2022-01-12T06:00">6:00 AM</time>
                    </p>
                  </a>
                </li>
                <li className="relative mt-px flex sm:col-start-3" style={{ gridRow: '92 / span 30' }}>
                  <a
                    href="#"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-pink-800 p-2 text-xs leading-5 hover:bg-pink-900"
                  >
                    <p className="order-1 font-semibold text-white">Flight to Paris</p>
                    <p className="text-pink-200 group-hover:text-pink-100">
                      <time dateTime="2022-01-12T07:30">7:30 AM</time>
                    </p>
                  </a>
                </li>
                <li className="relative mt-px hidden sm:col-start-5 sm:flex" style={{ gridRow: '122 / span 24' }}>
                  <a
                    href="#"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-gray-600 p-2 text-xs leading-5 hover:bg-gray-700"
                  >
                    <p className="order-1 font-semibold text-white">Meeting with design team at Disney</p>
                    <p className="text-gray-200 group-hover:text-gray-100">
                      <time dateTime="2022-01-15T10:00">10:00 AM</time>
                    </p>
                  </a>
                </li>
                <li className="relative mt-px hidden sm:col-start-2 sm:flex" style={{ gridRow: '122 / span 24' }}>
                  <a
                    href="#"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-gray-600 p-2 text-xs leading-5 hover:bg-gray-700"
                  >
                    <p className="order-1 font-semibold text-white">Test</p>
                    <p className="text-gray-200 group-hover:text-gray-100">
                      <time dateTime="2022-01-15T10:00">10:00 AM</time>
                    </p>
                  </a>
                </li>
              </ol> */}


              <ol
                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
                style={{ gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto' }}
              >

                <div 
                  className="relative mt-px flex col-start-1 col-end-8 w-full border-t-2 border-red-500 opacity-50"
                  style={{ top: `${((1.75/(15 * 60)) * currentTime )+ 1.75}rem` }}
                  // style ={{top: `${1.70 * 2.45}rem`}}
                > 
                </div>

                <div className={`relative mt-px flex col-start-${currentDayIndex} w-full  border-t-2 border-red-500`} 
                  style={{ top: `${((1.75/(15 * 60)) * currentTime )}rem` }}
                  // style ={{top: "1.75rem"}}
                >
                  <div className="absolute top-[-1px] left-0 transform -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-red-500 rounded-full">
                  </div>
                </div>
          

                {currentSchedule.blocks.map((block, index) => {
                  const start = new Date(block.start);
                  const end = new Date(block.end);

                  const startHour = start.getHours();
                  const startMinute = start.getMinutes();
                  const endHour = end.getHours();
                  const endMinute = end.getMinutes();
                  const startTime = startHour + (startMinute / 60);
                  const endTime = endHour + (endMinute / 60);

                  const startRow = (startTime * 60 * 0.2) + 2;
                  const duration = (endTime - startTime) * 60 * 0.2;
                  const MondayDate = weekDates[0].getDate();
                  const day = start.getDate() - MondayDate + 1;

              
                  if (index === currentSchedule.blocks.length - 1) {
                    console.log('block', block);
                    console.log('start', start);
                    console.log('end', end);
                    console.log('startHour', startHour);
                    console.log('startMinute', startMinute);
                    console.log('endHour', endHour);
                    console.log('endMinute', endMinute);
                    console.log('startRow', startRow);
                    console.log('duration', duration);
                    console.log('day', day);
                  } 
                 
                  return (
                    <Draggable
                      key={`${block.task}-${index}-${day}`}
                      axis="y"
                      onMouseDown={(e) => {
                        handleMouseDown(e);
                        e.stopPropagation()
                      }} 
                      allowAnyClick={false}
                      grid={[28, 28]} // Adjust this to set snapping grid size (28 pixels for snappy y-axis dragging)
                      onStart={(e, data) => handleStart(e, data)}
                      onDrag={(e, data) => handleDrag(e, data, block, index)}
                      onStop={(e) => handleStop(e)}
                    >
                      <li key={`${block.task}-${index}-${day}`} className={`relative mt-px flex sm:col-start-${day}`} style={{ gridRow: `${startRow} / span ${duration}` }}>
                          <Popover>
                            {/* Conditionally render PopoverTrigger based on dragging state */}
                            <PopoverTrigger  className='flex flex-row group absolute inset-1 justify-start items-start overflow-y-auto rounded-lg  bg-blue-800  text-xs leading-5 hover:bg-blue-900'>

                              {/* <div className='flex flex-row group absolute inset-1 justify-start items-start overflow-y-auto rounded-lg  bg-blue-800  text-xs leading-5 hover:bg-blue-900'> */}
                                <div className='h-full bg-blue-600 w-3'></div>
                                <a
                                  href="#"
                                  className="flex flex-col p-2 justify-start items-start"
                                  draggable={false}
                                >   
                                  <p className="font-semibold text-white ">{block.task}</p>
                                  <p className="text-blue-200 group-hover:text-blue-100 ">
                                    { (block.updatedStart !== block.start || block.updatedEnd !== block.end) ? 
                                      (<>
                                        <time dateTime={block.updatedStart}>{new Date(block.updatedStart).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</time> 
                                        <span>-</span> 
                                        <time dateTime={block.updatedEnd}>{new Date(block.updatedEnd).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</time>
                                      </> ) :   
                                      (<>
                                        <time dateTime={block.start}>{new Date(block.start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</time> 
                                        <span>-</span> 
                                        <time dateTime={block.end}>{new Date(block.end).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</time>
                                      </> )
                                    }
                                  </p>
                                </a> 
                              {/* </div> */}
                            </PopoverTrigger>
                            {/* Conditionally render PopoverContent based on dragging state */
                              (isPopoverVisible) && (
                                <PopoverContent className='h-48'  >
                                  <ResizablePanelGroup direction="vertical">
                                    <ResizablePanel defaultSize={75} maxSize={75} minSize={75}>
                                      <ResizablePanelGroup direction="horizontal">
                                        <ResizablePanel defaultSize={84} maxSize={84} minSize={84}>
                                        <div className='flex flex-col '>
                                          <p draggable={false}>{block.task}</p>
                                          <div className='flex flex-row mt-2'>
                                            <img src={clock} alt="clock" className='h-5' />
                                            <div className='flex flex-col ml-2'>
                                              <p draggable={false}>{new Date(block.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                              <p draggable={false}>{new Date(block.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                          </div>
                                        </div>
                                        </ResizablePanel>
                                        {/* <ResizableHandle  /> */}
                                        <ResizablePanel>
                                          <Sheet>
                                            <SheetTrigger>
                                              <Button variant="ghost" size="icon">
                                                <img src={expand} alt="expand" className='h-5' />
                                              </Button>
                                            </SheetTrigger>
                                            <SheetContent>
                                              <SheetHeader>
                                                <SheetTitle>Are you absolutely sure?</SheetTitle>
                                                <SheetDescription>
                                                  This action cannot be undone. This will permanently delete your account
                                                  and remove your data from our servers.
                                                </SheetDescription>
                                              </SheetHeader>
                                            </SheetContent>
                                          </Sheet>
                                        </ResizablePanel>
                                      </ResizablePanelGroup>       
                                    </ResizablePanel>
                                    <ResizableHandle />
                                    <ResizablePanel>
                                      <Sheet>
                                        <SheetTrigger>
                                          <div>
                                            <Button variant="secondary"  className='mt-3 h-6 mr-6'>Edit</Button>
                                            <Button variant="destructive"  className='mt-3 h-6'>Delete</Button>
                                          </div>
                                        </SheetTrigger>
                                        <SheetContent className=''>
                                          <SheetHeader>
                                            <SheetTitle>Are you absolutely sure?</SheetTitle>
                                            <SheetDescription>
                                              This action cannot be undone. This will permanently delete your account
                                              and remove your data from our servers.
                                            </SheetDescription>
                                          </SheetHeader>
                                        </SheetContent>
                                      </Sheet>
                                    </ResizablePanel>
                                  </ResizablePanelGroup>       
                                  
                                </PopoverContent>
                              )
                            }
                          </Popover>
                      </li>
                    </Draggable>
                  );
                })}
              </ol>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}


export default Calendar


