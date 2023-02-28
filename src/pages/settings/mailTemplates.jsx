import { useState, useCallback, useEffect,memo } from "react";
import { useHistory } from "react-router-dom";
import { useSession } from "../../context/AuthProvider"
import * as mails from '../../api/mails'
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header'; 
import List from '@editorjs/list'; 
import SimpleImage from '@editorjs/simple-image'
import { useForm } from "react-hook-form"
import {RiDeleteBin6Line} from 'react-icons/ri'


export default function MailTemplates() {

    const {ready} = useSession()
    const [editor,setEditor] = useState(undefined)
    const [templates,setTemplates] = useState()
    const [selected,setSelected] = useState(null)
    const history = useHistory()
    const [loading,setLoading] = useState()
    const [customError,setCustomError]=useState();
    const [bijlagen,setBijlagen] = useState(null)
    const [add,setAdd] = useState(false)
    const [body,setBody] = useState()
    const [naam,setNaam] = useState()
    const [onderwerp,setOnderwerp] = useState()
    
    const back = useCallback(async ()=>{
        if (add) {
            setAdd(false)
            setEditor(undefined)
            setBody(null)
            setBijlagen(null)
            setNaam()
            setOnderwerp()
        } 
        else if (selected === null) history.push('/')
        else {
            setSelected(null)
            setEditor(undefined)
            setBody(null)
            setBijlagen(null)
            setNaam()
            setOnderwerp()
        }
    },[history,selected,add])

    const refresh = useCallback(async ()=>{
        setLoading(true)
            const a = await mails.getAll()
            if (a === 404) setCustomError('Kon templates niet laden')
            else {
                setCustomError(null)
                setTemplates(a)
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

    const save = useCallback(async ({naam,onderwerp,variabelen})=>{
        setLoading(true)
        setCustomError(null)
        const data = await editor.save().then(x=>{return x}).catch(x=>setCustomError('Kon gegevens niet verwerken.'))
        const e = add ? await mails.createTemplate(naam,onderwerp,data,null,bijlagen ? bijlagen : []) : await mails.updateTemplate(selected?.tid,naam,onderwerp,data,variabelen ? JSON.parse(variabelen) : null,bijlagen ? bijlagen : [])
        if (!e) {setCustomError('Kon template niet opslaan'); setLoading(false); setEditor(new EditorJS({
            holder: 'editorjs', 
             tools: { 
                header: Header, 
                list: List,
                image: SimpleImage,
              }, 
              data: data
          }))
        }
        else {
            await refresh()
            await back()
        }
        
        setLoading(false)
    },[selected,bijlagen,editor,add,back,refresh])

    const deleteTemp = async ()=>{
        await mails.deleteTemplate(selected?.tid)
        await refresh()
        await back()
    }

    const addFiles = useCallback(async (event)=>{
        const data = await editor.save().then(x=>{return x}).catch(x=>setCustomError('Kon gegevens niet verwerken.'))
        const name = document.getElementById("naam").value
        const ond = document.getElementById("onderwerp").value
        setNaam(name)
        setOnderwerp(ond)
        setBody(data)
        const temp = bijlagen? [...bijlagen] : []
        for (let index = 0; index < event.target.files.length; index++) {
            temp.push({name: event.target.files[index].name,url: await toBase64(event.target.files[index])})
        }
        setBijlagen(temp)
        setEditor(null)
    },[bijlagen,editor,toBase64])

    const del = useCallback(async (x)=>{
        const data = await editor.save().then(x=>{return x}).catch(x=>setCustomError('Kon gegevens niet verwerken.'))
        const name = document.getElementById("naam").value
        const ond = document.getElementById("onderwerp").value
        setNaam(name)
        setOnderwerp(ond)
        setBody(data)
        const temp = [...bijlagen]
        temp.splice(temp.indexOf(x),1)
        setBijlagen(temp)
        setEditor(null)
    },[bijlagen,editor])

    const Editing = memo(props=>{
        const { register, handleSubmit, formState: {errors} } = useForm();
        return <><form onSubmit={handleSubmit(save)} className='grid flex-w justify fullwidth'>
        <label className="acclabel" >Naam: </label>
        <input id="naam" className="accvalue inputfix" defaultValue={add || naam ? naam : selected?.tnaam} {...register('naam',{required: 'Dit is vereist'})}/>
        {errors.naam && <><div className='acclabel'></div><p className='accvalue error' >{errors.naam.message}</p></>}
        <label className="acclabel">Onderwerp: </label>
        <input id="onderwerp" className="accvalue inputfix" defaultValue={add || onderwerp ? onderwerp : selected?.tonderwerp} {...register('onderwerp',{required: 'Dit is vereist'})}/>
        {errors.onderwerp && <><div className='acclabel'></div><p className='accvalue error' >{errors.onderwerp.message}</p></>}
        {add || selected?.vars === null ? '' : <><label className="acclabel">Variabelen: </label>
        <input id="variabelen" className="accvalue inputfix" defaultValue={JSON.stringify(selected.vars)} {...register('variabelen',{required: 'Dit is vereist'})}></input>
        {errors.variabelen && <><div className='acclabel'></div><p className='accvalue error' >{errors.variabelen.message}</p></>}
        </>
         }
        <div className="margin20 fullwidth" />
        <div id="editorjs" className="editor"/> 
        <div className="fullwidth margin20"/>
        <label className="acclabel">Bijlagen: </label>
        <input type='file' className="margin20 accvalue" multiple onChange={addFiles}/>
        {bijlagen ? bijlagen?.map(x=>{
            return <div key={x.name} className="fullwidth flex-w"><button className="delete wwwijzig width20 marginreset" type="button" onClick={()=>del(x)}><RiDeleteBin6Line/></button><div className="width80 textcenter autopadding">{x.name}</div><div className="fullwidth margin20" /></div>
        }) : selected?.bijlagen?.map(x=>{
            return <div key={x.name} className="fullwidth flex-w"><button className="delete wwwijzig width20 marginreset" type="button" onClick={()=>del(x)}><RiDeleteBin6Line/></button><div className="width80 textcenter autopadding">{x.name}</div><div className="fullwidth margin20" /></div>
        })}
        <button disabled={loading} className="wwwijzig" type="submit">Opslaan</button>
    </form>
    {add || selected?.vars !== null ? '':<button className="wwwijzig delete" onClick={()=>deleteTemp()}>Verwijderen</button>}
    </>
    })
    const Template = memo(props=>{
        return <>
        <div className={`lidlijst`} onClick={()=>{selected?.tid === props.ob.tid ? setSelected(null) : setSelected(props.ob)}}>
            <div className=" center flex">{props.ob.tnaam}</div>
        </div>
        </>
    })
    if (ready && templates) {
        if (selected !== null || add) {
            if (selected !== null && bijlagen === null) {
                setBijlagen(selected.bijlagen)
            }
        if (!editor) {
            setEditor(new EditorJS({
                holder: 'editorjs', 
                 tools: { 
                    header: Header, 
                    list: List,
                    image: SimpleImage,
                  },
                  data: add || body ? body : selected?.body,
              }))
        }
        
    return <>
        <button className='backbutton margin20' onClick={back}>{'<'} Terug</button>
        {customError ? (<p className="error">{customError}</p>): null}
        <Editing/>
    </>
    }
    return <>
            <button className='backbutton margin20' onClick={back}>{'<'} Terug</button>
            {customError ? (<p className="error">{customError}</p>): null}
            {templates.map(template=>{
                return template.tid > 5 ? <Template ob={template} key={template.tid}/> : ''
    })}
    <div className='margin20'/>
    <button className='wwwijzig' onClick={()=>setAdd(true)} disabled={loading}>Nieuwe template</button>
    <div className="margin20 line grid"/>
    <p>Systeem Templates:</p>
    {templates.map(template=>{
        return template.tid < 6 ? <Template ob={template} key={template.tid}/> : ''
    })}
    </>
}
    return <><button className='backbutton margin20' onClick={back}>{'<'} Terug</button><div>Loading...</div></>
}