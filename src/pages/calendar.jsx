import { useHistory } from "react-router-dom";
import { useCallback, memo, useState, useEffect } from 'react';
import CalendarComponent from "../components/CalendarComp";
import { useSession } from "../context/AuthProvider"
import { getTrainings } from "../api/training";
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header'; 
import List from '@editorjs/list'; 
import SimpleImage from '@editorjs/simple-image'

const formatEvents = async (events) => {
    const formatted = events.map( async (event) => {
        const {trid,trcreator,voornaam,achternaam,trdatumstart,trdatumend,trgroep,groepnaam,kleur,tronderwerp,trbody,trstatus} = event
        return {
            id:trid,
            title: tronderwerp,
            start: trdatumstart,
            end: trdatumend,
            trbody,
            trstatus,
            trcreator,
            backgroundColor:kleur,
            groepnaam,
            trgroep,
            voornaam,
            achternaam
        }
    })
    return await Promise.all(formatted)
}

export default function Calendar() {
    const history = useHistory()
    const [events,setEvents] = useState()
      const [selected,setSelected] = useState(null)
      const [newEvent,setNewEvent] = useState(null)
      const [loading,setLoading] = useState()
      const {ready,lid } = useSession()
      const [customError,setCustomError] = useState()
      const back = useCallback(async ()=>{
        history.push('/')
    },[history])
    const goToTraining = useCallback(()=>{
        history.push('/trainings/?key='+selected?.event.id)
    },[history,selected])

    const customSelect = useCallback(async (e)=>{
        setSelected(e)
        setNewEvent(undefined)
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth', // Use 'smooth' for smooth scrolling
          });
    },[])

      const refresh = useCallback(async ()=>{
        const e = await getTrainings()
        if (!e) setCustomError('Kon trainingen niet laden')
        else {
            setEvents(await formatEvents(e.training))
        } 
        setLoading(false)
    },[])

      useEffect( ()=>{
        if (ready) {
            refresh()
        }
    },[ready,refresh])

    const Status = memo(()=>{
        const strings = ["Niet afgewerkt","Aanwezigheden ingegeven","Afgewerkt","Betaald"]
        return <div className="accvalue">{strings[selected?.event.extendedProps.trstatus]}</div>
    })

    const Details = memo(()=>{
    new EditorJS({
        holder: 'editorjs', 
         tools: { 
            header: Header, 
            list: List,
            image: SimpleImage,
          }, 
          data: selected.event.extendedProps.trbody,
          readOnly: true
      })
        return <div className="grid flex-w justify fullwidth">
            <label className="acclabel">Groep: </label>
            <div className="accvalue" >{selected?.event.extendedProps.groepnaam}</div>
            <label className="acclabel">Trainer: </label>
            <div className="accvalue">{selected?.event.extendedProps.voornaam+' '+selected?.event.extendedProps.achternaam}</div>
            <label className="acclabel">Begint op: </label>
            <div className="accvalue">{(selected?.event.startStr.replace(/T(\d{2}:\d{2}).*$/, " om $1"))}</div>
            <label className="acclabel">Eindigt op: </label>
            <div className="accvalue">{(selected?.event.endStr.replace(/T(\d{2}:\d{2}).*$/, " om $1"))}</div>            
            { lid.roles.includes("trainer") && <><label className="acclabel">Status: </label>
            <Status /></>}
            <label className="acclabel">Onderwerp: </label>
            <div className="accvalue">{selected?.event.title}</div>
            <div className="margin20 fullwidth" />
            <div id="editorjs" className="editor"/>
            {lid.roles.includes("trainer") && <button className="wwwijzig" onClick={()=>goToTraining()}>Wijzig</button>}
        </div>
    })
    return <><button className='backbutton margin20' onClick={back}>{'<'} Terug</button>
    {customError && <p className="error">{customError}</p>}
    {loading && <p>Loading...</p>}
    {events && <CalendarComponent selectable={true} editable={false} setNewEvent={setNewEvent} setEvent={customSelect} events={events}/>}
    <div className="margin20 fullwidth" />
    {(selected && !newEvent) && <Details/>}
    <div className="margin20 fullwidth" />
    </>
}