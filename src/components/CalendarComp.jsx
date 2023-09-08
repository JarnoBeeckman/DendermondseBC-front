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
          />
        </>
      );
}