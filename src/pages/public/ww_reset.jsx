import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form"
import { useCallback, useState } from "react";
import * as lid from "../../api/lid"

export default function ResetPassword() {

    const { register, handleSubmit, formState: {errors} } = useForm();
    const history = useHistory();
    const [done,setDone] = useState(false)
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState()
    const param = new URLSearchParams(window.location.search)
    const [key] = useState(param.get("key"))

    const back = useCallback(async ()=>{
        history.push('/')
    },[history])

    const exe = useCallback(async ({wachtwoord,wachtwoordd})=>{
        setLoading(true)
        if (wachtwoord !== wachtwoordd) setError("Wachtwoorden komen niet overeen.")
        else {
        const e = await lid.reset(key,wachtwoord)
        if (e) {
            setDone(true)
        }
        else setError('Kon wachtwoord niet resetten.')
        }
        setLoading(false)
    },[key])

    if (!key) return <div>Geen geldige URL.</div>
    if (done)
    return <>
        <button className='backbutton margin20' onClick={back}>{'<'} Terug</button>
        <p>Uw wachtwoord werd gewijzigd.</p>
    </>
    return <>
        <button className='backbutton margin20' onClick={back}>{'<'} Terug</button>
        {error ? (<p className="error">{error}</p>): null}
        <form className="grid flex-w accgrid" onSubmit={handleSubmit(exe)}>
        <label className='acclabel'>Nieuw wachtwoord: </label>
        <input className='accvalue' type='password' placeholder='nieuw' {...register('wachtwoord',{required: 'Dit is vereist',minLength:{value:7,message:'Dit moet minstens 7 tekens bevatten'}})}/>
        {errors.wachtwoord && <><div className='acclabel'></div><p className='accvalue error'>{errors.wachtwoord.message}</p></>}                       
        <label className='acclabel'>Herhaal nieuw wachtwoord: </label>
        <input className='accvalue' type='password' placeholder='herhaal'{...register('wachtwoordd',{required: 'Dit is vereist',minLength:{value:7,message:'Dit moet minstens 7 tekens bevatten'}})}/>
        {errors.wachtwoordd && <><div className='acclabel'></div><p className='accvalue error'>{errors.wachtwoordd.message}</p></>}
        <button className="wwwijzig" disabled={loading} type="submit">Reset wachtwoord</button>
        </form>
    </>
}