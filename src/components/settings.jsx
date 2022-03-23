import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form"
import { useCallback, useEffect, useState } from "react";
import {useSession} from '../context/AuthProvider'

export default function Settings() {
    const history = useHistory()
    const [edit,setEdit] = useState(false);
    const [customError,setCustomError] = useState(null)
    const [settings,setSettings] = useState()
    const {ready} = useSession()
    const { register, handleSubmit, formState: {errors} } = useForm();

    const refresh = useCallback(async ()=>{
        const e = 1
        if (!e) setCustomError('Kon de instellingen niet laden')
        else setSettings(e)
    },[])

    const handleSub = useCallback(async ()=>{
        const e = 1
        if (!e) setCustomError('Kon instellingen niet wijzigen')
        else {
            await refresh()
            setEdit(false)
        }
    },[refresh])
    const back = useCallback(async ()=>{
        history.push('/')
    },[history])

    

    useEffect(()=>{
        if (ready) {
            refresh()
        }
    },[ready,refresh])

    if (!edit && settings && ready)
    return (
        <>
            <button className='backbutton' onClick={back}>{'<'} Terug</button>
            {customError ? (<p className="error">{customError}</p>): null}
            <div className="grid flex-w flex-sb">
                <label className="acclabel">First: </label>
                <div className="accvalue"></div>
                <button className="wwwijzig" onClick={()=>setEdit(true)}>Wijzigen</button>
            </div>
        </>
    )
    else if (settings && ready) return (
        <>
            <button className='backbutton' onClick={()=>setEdit(false)}>{'<'} Terug</button>
            {customError ? (<p className="error">{customError}</p>): null}
            <form className='grid flex-w accgrid' onSubmit={handleSubmit(handleSub)}>
               <label className='acclabel'>Username: </label>
                   <input className='accvalue' type='text' placeholder='username' defaultValue={settings.username} {...register('username',{required: 'Dit is vereist'})} />
                   {errors.username && <><div className='acclabel'></div><p className='accvalue error'>{errors.username.message}</p></>}
                   <button className="wwwijzig" type='submit'>Bevestigen</button>
            </form>
        </>
    ); else return(<div>Loading...</div>)
}