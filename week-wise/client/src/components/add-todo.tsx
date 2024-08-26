import React from 'react'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { Schedule } from './homepage';

// interface AddToDoProps {
//   currentSchedule: Schedule;
//   setCurrentSchedule: React.Dispatch<React.SetStateAction<Schedule>>;
// }

const AddToDo = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-5 text-center hover:border-gray-400 focus:outline-none"
        >
          <span className=" block text-sm font-semibold text-gray-200">Add To Do</span>
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className='mb-5'>
          <SheetTitle>New Task</SheetTitle>
          <SheetDescription>
            Enter the details of your new task
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 text-white">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="Enter your email" type="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Enter your message" className="min-h-[100px]" />
          </div>
          <Button type="submit">Submit</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default AddToDo