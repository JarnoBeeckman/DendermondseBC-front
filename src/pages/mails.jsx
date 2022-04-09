import { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useGetAllLeden,useSession } from "../context/AuthProvider"
import * as mails from '../api/mails'
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header'; 
import List from '@editorjs/list'; 

export default function Mails() {

    const {ready} = useSession()
    const [leden,setLeden] = useState()
    const history = useHistory()
    const [loading,setLoading] = useState()
    const [customError,setCustomError]=useState();
    const list = useGetAllLeden()

    const back = useCallback(async ()=>{
        history.push('/')
    },[history])

    const refresh = useCallback(async ()=>{
        setLoading(true)
        const e = await list()
        if (e === 404) setCustomError('Kon leden niet laden')
        else {
            setLeden(e)
            setCustomError(null)
        } 
        setLoading(false)
    },[list])

    useEffect(()=>{
        if (ready)
            refresh()
    },[ready,refresh])

    const send = useCallback(async ()=>{
        setLoading(true)
        const e = await mails.sendMail()
        if (!e) setCustomError('Kon mail niet versturen')
        setLoading(false)
    },[])

    

    if (ready && leden) {
        const editor = new EditorJS({ 
            /** 
             * Id of Element that should contain the Editor 
             */ 
            holder: 'editorjs', 
          
            /** 
             * Available Tools list. 
             * Pass Tool's class or Settings object for each Tool you want to use 
             */ 
            tools: { 
              header: {
                class: Header, 
                inlineToolbar: ['link'] 
              }, 
              list: { 
                class: List, 
                inlineToolbar: true 
              } 
            }, 
          })
    return <>
        <button className='backbutton margin20' onClick={back}>{'<'} Terug</button>
        {customError ? (<p className="error">{customError}</p>): null}

        <div id="editorjs" className="editor"></div>   
        
        <button disabled={loading} className="wwwijzig" onClick={()=>send()}>Versturen</button>

    </>
    }
    return <><button className='backbutton margin20' onClick={back}>{'<'} Terug</button><div>Loading...</div></>
}