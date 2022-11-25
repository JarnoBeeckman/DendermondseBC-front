import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form"
import { useCallback, useState } from "react";
import * as lidapi from "../../api/lid"
import {useSession, useSetSession } from "../../context/AuthProvider"

export default function ResetPassword() {

    const { register, handleSubmit, formState: {errors} } = useForm();
    const history = useHistory();
    const {loading} = useSession();
    const [loadingg,setLoading] = useState(false)
    const [error,setError] = useState()
    const setSession = useSetSession()
    //const param = new URLSearchParams(window.location.search)
    //const [key] = useState(param.get("key"))

    const back = useCallback(async ()=>{
        history.push('/')
    },[history])

    const exe = useCallback(async ({key,wachtwoord,wachtwoordd})=>{
        setLoading(true)
        if (wachtwoord !== wachtwoordd) setError("Wachtwoorden komen niet overeen.")
        else {
        const e = await lidapi.reset(key,wachtwoord)
        if (e) {
            await setSession(e.token,e.lid)
            history.push('/')
        }
        else setError('Kon wachtwoord niet resetten. Controleer code of probeer later opnieuw.')
        }
        setLoading(false)
    },[history,setSession])

    //if (!key) return <div>Geen geldige URL.</div>
    return <>
        <button className='backbutton margin20' onClick={back}>{'<'} Terug</button>
        {error ? (<p className="error">{error}</p>): null}
        <p>Er werd een mail gestuurd met een reset code voor je account.<br/>Als je deze pagina verlaat zal deze code geldig blijven tot je wachtwoord is gewijzigd.</p>
        <form className="grid flex-w accgrid" onSubmit={handleSubmit(exe)}>
        <div className="margin20 fullwidth"/>
        <label className='acclabel'>Reset code: </label>
        <input className='accvalue' type='text' placeholder='reset code' {...register('key',{required: 'Dit is vereist'})}/>
        {errors.key && <><div className='acclabel'></div><p className='accvalue error'>{errors.key.message}</p></>} 
        <label className='acclabel'>Nieuw wachtwoord: </label>
        <input className='accvalue' type='password' placeholder='wachtwoord' {...register('wachtwoord',{required: 'Dit is vereist',minLength:{value:7,message:'Dit moet minstens 7 tekens bevatten'}})}/>
        {errors.wachtwoord && <><div className='acclabel'></div><p className='accvalue error'>{errors.wachtwoord.message}</p></>}                       
        <label className='acclabel'>Herhaal nieuw wachtwoord: </label>
        <input className='accvalue' type='password' placeholder='herhaal wachtwoord'{...register('wachtwoordd',{required: 'Dit is vereist',minLength:{value:7,message:'Dit moet minstens 7 tekens bevatten'}})}/>
        {errors.wachtwoordd && <><div className='acclabel'></div><p className='accvalue error'>{errors.wachtwoordd.message}</p></>}
        <button className="wwwijzig" disabled={loadingg || loading} type="submit">Reset wachtwoord</button>
        </form>
    </>
}