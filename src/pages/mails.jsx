import { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSession } from "../context/AuthProvider"
import * as mails from '../api/mails'
import * as groep from '../api/groep'
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header'; 
import List from '@editorjs/list'; 
import SimpleImage from '@editorjs/simple-image'
import { useForm } from "react-hook-form"
import {RiDeleteBin6Line} from 'react-icons/ri'


export default function Mails() {

    const {ready} = useSession()
    const [editor,setEditor] = useState(undefined)
    const [groepen,setGroepen] = useState()
    const history = useHistory()
    const [loading,setLoading] = useState()
    const [customError,setCustomError]=useState();
    const { register, handleSubmit, formState: {errors} } = useForm();
    const [receivers,setReceivers] = useState([])
    const [bijlagen,setBijlagen] = useState([])
    
    const back = useCallback(async ()=>{
        history.push('/')
    },[history])

    const refresh = useCallback(async ()=>{
        setLoading(true)
            const a = await groep.getAll()
            if (a === 404) setCustomError('Kon groepen niet laden')
            else {
                setCustomError(null)
                setGroepen(a)
            }
        setLoading(false)
    },[])

    useEffect(()=>{
        if (ready)
            refresh()
    },[ready,refresh])

    const toBase64 = useCallback(file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    }),[]);

    const send = useCallback(async ({onderwerp,cc,bcc})=>{
        setLoading(true)
        setCustomError(null)
        if (receivers.length === 0 && cc.replace(/\s/g, "") === '') {
            setCustomError('Ontvangers of CC ontbreken')
        } else {
        const data = await editor.save().then(x=>{return x}).catch(x=>setCustomError('Kon gegevens niet verwerken.'))
        const list = []
        for (let index = 0; index < bijlagen.length; index++) {
            list.push({name: bijlagen[index].name,url: await toBase64(bijlagen[index])})
        }
        const e = await mails.sendMail(receivers,cc.replace(/\s/g, ""),bcc,onderwerp,data.blocks,list)
        if (!e) {setCustomError('Kon mail niet versturen'); setLoading(false)}
        }
        setLoading(false)
    },[receivers,bijlagen,toBase64,editor])

    const filter = useCallback((id)=>{
        const e = receivers
        if (e.length !== 1) {
             e.splice(e.indexOf(id),1)
             setReceivers([...e])
        } else
        return setReceivers([])
    },[receivers])

    const addFiles = useCallback(async (event)=>{
        const temp = [...bijlagen]
        for (let index = 0; index < event.target.files.length; index++) {
            temp.push(event.target.files[index])
        }
        setBijlagen(temp)
    },[bijlagen])

    const del = useCallback(async (x)=>{
        const temp = [...bijlagen]
        temp.splice(temp.indexOf(x),1)
        setBijlagen(temp)
    },[bijlagen])
    
    if (ready && groepen) {
        if (!editor)
    setEditor(new EditorJS({
        holder: 'editorjs', 
         tools: { 
            header: Header, 
            list: List,
            image: SimpleImage,
          }, 
      }))
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
            <label className="acclabel">BCC: </label>
            <input className="accvalue height20 paddingrightauto" type='checkbox' defaultChecked={true} {...register('bcc')} />
            <label className="acclabel">CC: </label>
            <input className="accvalue inputfix" {...register('cc')} />
            <label className="acclabel"></label>
            <label className="accvalue"><i>Split adressen met komma</i></label>
            {errors.cc && <><div className='acclabel'></div><p className='accvalue error' >{errors.cc.message}</p></>}
            <label className="acclabel">Onderwerp: </label>
            <input className="accvalue inputfix" {...register('onderwerp',{required: 'Dit is vereist'})}/>
            {errors.onderwerp && <><div className='acclabel'></div><p className='accvalue error' >{errors.onderwerp.message}</p></>}
            <div className="margin20 fullwidth" />
            <div id="editorjs" className="editor"/> 
            <div className="fullwidth margin20"/>
            <label className="acclabel">Bijlagen: </label>
            <input type='file' className="margin20 accvalue" multiple onChange={addFiles}/>
            {bijlagen?.map(x=>{
                return <div key={x.name} className="fullwidth flex-w"><button className="delete wwwijzig width20 marginreset" type="button" onClick={()=>del(x)}><RiDeleteBin6Line/></button><div className="width80 textcenter autopadding">{x.name}</div><div className="fullwidth margin20" /></div>
            })}
            <button disabled={loading} className="wwwijzig" type="submit">Versturen</button>
        </form>
    </>
    }
    return <><button className='backbutton margin20' onClick={back}>{'<'} Terug</button><div>Loading...</div></>
}