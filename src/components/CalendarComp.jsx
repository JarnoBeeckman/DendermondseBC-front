import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default function CalendarComponent(props) {
      return (
        <>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin,interactionPlugin]} 
            initialView="timeGridWeek" 
            initialEvents={props.events} 
            firstDay={1}
            allDaySlot={false}
        headerToolbar={{
          left: 'prev,next today',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        eventClick={props.setEvent}
        editable={props.editable}
        selectable={props.selectable}
        select={props.setNewEvent}
        height="500px"
        slotMinTime= '07:00:00'  // Sets the minimum time to 7:00 am
        slotMaxTime= '24:00:00'
          />
        </>
      );
}