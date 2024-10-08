import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import {
  Eventcalendar,
  getJson,
  MbscCalendarEvent,
  MbscEventcalendarView,
  MbscEventClickEvent,
  setOptions,
  Toast,
} from '@mobiscroll/react';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';

setOptions({
  theme: 'ios',
  themeVariant: 'dark'
});

const App: FC = () => {
  const [myEvents, setEvents] = useState<MbscCalendarEvent[]>([]);
  const [isToastOpen, setToastOpen] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>();

  const myView = useMemo<MbscEventcalendarView>(
    () => ({
      schedule: { type: 'week' },
    }),
    [],
  );

  const handleCloseToast = useCallback(() => {
    setToastOpen(false);
  }, []);

  const handleEventClick = useCallback((args: MbscEventClickEvent) => {
    setToastText(args.event.title);
    setToastOpen(true);
  }, []);

  useEffect(() => {
    getJson(
      'https://trial.mobiscroll.com/events/?vers=5',
      (events: MbscCalendarEvent[]) => {
        setEvents(events);
      },
      'jsonp',
    );
  }, []);

  return (
    <>
      <Eventcalendar
        clickToCreate={true}
        dragToCreate={true}
        dragToMove={true}
        dragToResize={true}
        eventDelete={true}
        data={myEvents}
        view={myView}
        renderHeader={() => <></>}
        
        onEventClick={handleEventClick}
        className='rounded-lg'
      />
      <Toast message={toastText} isOpen={isToastOpen} onClose={handleCloseToast} />
    </>
  );
};
export default App;