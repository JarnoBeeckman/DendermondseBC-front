import { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useGetAllLeden,useSession } from "../context/AuthProvider"
import * as mails from '../api/mails'
import * as groep from '../api/groep'
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header'; 
import List from '@editorjs/list'; 
import SimpleImage from '@editorjs/simple-image'
import { useForm } from "react-hook-form"


let editor;

export default function Mails() {

    const {ready} = useSession()
    const [leden,setLeden] = useState()
    const [groepen,setGroepen] = useState()
    const history = useHistory()
    const [loading,setLoading] = useState()
    const [customError,setCustomError]=useState();
    const list = useGetAllLeden()
    const { register, handleSubmit, formState: {errors} } = useForm();
    const [receivers,setReceivers] = useState([])

    const back = useCallback(async ()=>{
        history.push('/')
    },[history])

    const refresh = useCallback(async ()=>{
        setLoading(true)
        const e = await list()
        if (e === 404) setCustomError('Kon leden niet laden')
        else {
            setLeden(e)
            const a = await groep.getAll()
            if (a === 404) setCustomError('Kon groepen niet laden')
            else {
                setCustomError(null)
                setGroepen(a)
            }
        } 
        setLoading(false)
    },[list])

    useEffect(()=>{
        if (ready)
            refresh()
    },[ready,refresh])

    const send = useCallback(async ({onderwerp})=>{
        setLoading(true)
        const data = await editor.save().then(x=>{return x}).catch(x=>setCustomError('Kon gegevens niet verwerken.'))
        const e = await mails.sendMail(receivers,false,true,onderwerp,data.blocks)
        if (!e) setCustomError('Kon mail niet versturen')
        setLoading(false)
    },[receivers])

    const filter = useCallback((id)=>{
        const e = receivers
        if (e.length !== 1) {
             e.splice(e.indexOf(id),1)
             setReceivers([...e])
        } else
        return setReceivers([])
    },[receivers])

    if (ready && leden && groepen) {
        if (!editor)
        editor = new EditorJS({ 
            holder: 'editorjs', 
             tools: { 
                header: Header, 
                list: List,
                image: SimpleImage,
              }, 
          })
    return <>
        <button className='backbutton margin20' onClick={back}>{'<'} Terug</button>
        {customError ? (<p className="error">{customError}</p>): null}
          <form onSubmit={handleSubmit(send)} className='grid flex-w justify fullwidth'>
            <label className="acclabel">Ontvangers: </label>
            <div className="accvalue flex-w">
                <label className="radiolabel"><input type='radio' checked={receivers.includes(-2)} onChange={()=>null} onClick={()=> receivers.includes(-2) ? setReceivers([]) : setReceivers([-2])} />Iedereen</label>
                <label className="radiolabel"><input type='radio' checked={receivers.includes(-1)} onChange={()=>null} onClick={()=> receivers.includes(-1) ? setReceivers([]) : setReceivers([-1])} />Actieve leden</label>
                {groepen.map(x=>{
                    return <label className="radiolabel" key={x.gid}><input type='radio' disabled={receivers.includes(-1) || receivers.includes(-2)} checked={receivers.includes(x.gid)} onChange={()=>null} onClick={()=>receivers.includes(x.gid) ? filter(x.gid) : setReceivers([...receivers,x.gid])} />{x.groepnaam}</label>
                })}
            </div>
            <label className="acclabel">Onderwerp: </label>
            <input className="accvalue inputfix" {...register('onderwerp',{required: 'Dit is vereist'})}/>
            {errors.onderwerp && <><div className='acclabel'></div><p className='accvalue error' >{errors.onderwerp.message}</p></>}
            <div id="editorjs" className="editor"/> 
            <button disabled={loading} className="wwwijzig" type="submit">Versturen</button>
        </form>
    </>
    }
    return <><button className='backbutton margin20' onClick={back}>{'<'} Terug</button><div>Loading...</div></>
}