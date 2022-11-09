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
    const [selected,setSelected] = useState('0')
    const [templates,setTemplates] = useState()
    const [success,setSuccess] = useState(false)
    const [verzender,setVerzender] = useState(null)

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
                const e = await mails.getAll()
                if (e === 404) setCustomError('Kon templates niet laden')
                else {
                    setCustomError(null)
                    setTemplates(e)
                }
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

    const send = useCallback(async ({onderwerp,cc,isVanilla})=>{
        setLoading(true)
        setCustomError(null)
        if (receivers.length === 0 && cc.replace(/\s/g, "") === '') {
            setCustomError('Ontvangers of CC ontbreken')
        } else if (verzender === null) {
            setCustomError('Verzender ontbreekt')
        } else {
        const data = await editor.save().then(x=>{return x}).catch(x=>setCustomError('Kon gegevens niet verwerken.'))
        const e = await mails.sendMail(receivers,cc.replace(/\s/g, ""),onderwerp,isVanilla,data.blocks,bijlagen,verzender)
        if (!e) setCustomError('Kon mail niet versturen');
       else setSuccess(true)
        }
        setLoading(false)
    },[receivers,bijlagen,editor,verzender])

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
            const e = event.target.files[index]
            temp.push({name: e.name,url: await toBase64(e)})
        }
        setBijlagen(temp)
    },[bijlagen,toBase64])

    const changeTemplate = useCallback(async (event)=>{
        setSelected(event)
        if (event !== '0') {
            const e = templates.find(x=>x.tid === parseInt(event))
            if (editor) editor.render(e.body)
            setBijlagen(e.bijlagen)
        } else {
            if (editor) editor.clear()
            setBijlagen([])
        }
    },[templates,editor])

    const del = useCallback(async (x)=>{
        const temp = [...bijlagen]
        temp.splice(temp.indexOf(x),1)
        setBijlagen(temp)
    },[bijlagen])
    if (ready && groepen && templates) {
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
          <label className="acclabel">Template: </label>
          <div className="accvalue inputfix">
            <select className="accvalue inputfix" onChange={e=>changeTemplate(e.target.value)} defaultValue={selected}>
                    <option value={0}>Geen</option>
                    {templates.map(x=>(x.tid > 5 ? <option key={x.tid} value={x.tid}>{x.tnaam}</option> : ''))}
            </select>
            </div> 
            <label className="acclabel">Ontvangers: </label>
            <div className="accvalue flex-w">
                <label className="radiolabel"><input type='radio' checked={receivers.includes(-2)} onChange={()=>null} onClick={()=> receivers.includes(-2) ? setReceivers([]) : setReceivers([-2])} />Iedereen</label>
                <label className="radiolabel"><input type='radio' checked={receivers.includes(-1)} disabled={receivers.includes(-2)} onChange={()=>null} onClick={()=> receivers.includes(-1) ? filter(-1) : setReceivers([...receivers,-1])} />Volwassenen</label>
                {groepen.map(x=>{
                    return <label className="radiolabel" key={x.gid}><input type='radio' disabled={receivers.includes(-2)} checked={receivers.includes(x.gid)} onChange={()=>null} onClick={()=>receivers.includes(x.gid) ? filter(x.gid) : setReceivers([...receivers,x.gid])} />{x.groepnaam}</label>
                })}
            </div>
            <label className="acclabel">CC: </label>
            <input className="accvalue inputfix" {...register('cc')} />
            <label className="acclabel"></label>
            <label className="accvalue"><i>Split adressen met komma</i></label>
            {errors.cc && <><div className='acclabel'></div><p className='accvalue error' >{errors.cc.message}</p></>}
            <label className="acclabel">Onderwerp: </label>
            <input className="accvalue inputfix" defaultValue={selected === '0' ? '' : templates.find(x=>x.tid === parseInt(selected)).tonderwerp} {...register('onderwerp',{required: 'Dit is vereist'})}/>
            {errors.onderwerp && <><div className='acclabel'></div><p className='accvalue error' >{errors.onderwerp.message}</p></>}
            <div className="margin20 fullwidth" />
            <div id="editorjs" className="editor"/> 
            <div className="fullwidth margin20"/>
            <label className="acclabel">Bijlagen: </label>
            <input type='file' className="margin20 accvalue" multiple onChange={addFiles}/>
            {bijlagen?.map(x=>{
                return <div key={x.name} className="fullwidth flex-w"><button className="delete wwwijzig width20 marginreset" type="button" onClick={()=>del(x)}><RiDeleteBin6Line/></button><div className="width80 textcenter autopadding">{x.name}</div><div className="fullwidth margin20" /></div>
            })}
            <label className="acclabel">Opgemaakte mail (beta test): </label>
            <input className="accvalue height20 paddingrightauto" type="checkbox" {...register('isVanilla')}/>
            {errors.isVanilla && <><div className='acclabel'></div><p className='accvalue error' >{errors.isVanilla.message}</p></>}
            <label className="acclabel">Verzender: </label>
            <div className="accvalue">
            <label className="radiolabel"><input type='radio' onChange={()=>null} onClick={()=>setVerzender(false)} name="verzender" value={0}  />Info</label>
            <label className="radiolabel"><input type='radio' onChange={()=>null} onClick={()=>setVerzender(true)} name="verzender" value={1} />Jeugd</label>
            </div>
            {success ? <p className="success">Mail verzonden, deze kan vertraging hebben.</p> : null}
            <button disabled={loading || success} className="wwwijzig" type="submit">Versturen</button>
        </form>
    </>
    }
    return <><button className='backbutton margin20' onClick={back}>{'<'} Terug</button><div>Loading...</div></>
}