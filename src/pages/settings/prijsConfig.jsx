import { memo, useCallback, useEffect, useState } from 'react'
import {useHistory} from 'react-router-dom'
import {useSession} from '../../context/AuthProvider'
import * as prijs from '../../api/facts'
import { useForm } from "react-hook-form"

export default function PrijsConfig() {

    const [customError,setCustomError]=useState();
    const [loading,setLoading] = useState()
    const [prijzen,setPrijzen] = useState()
    const {ready} = useSession()
    const history = useHistory()
    const back = useCallback(async()=>{
        history.push('/settings')
    },[history])

    const refresh = useCallback(async ()=>{
        setLoading(true)
        const e = await prijs.getPrijzen()
        if (e === 404) setCustomError('Kon groepen niet laden')
        else {
            setPrijzen(e)
            setCustomError(null)
        } 
        setLoading(false)
    },[])

    useEffect(()=>{
        if (ready)
            refresh()
    },[ready,refresh])

    const updateInschrijvingen = useCallback(async ({comp,recreant,jeugd})=>{
        setLoading(true)
        const e = await prijs.updateInschrijvingen(comp,recreant,jeugd)
        if (!e) setCustomError('Kon wijzigingen niet maken')
        else await refresh()
        setLoading(false)
    },[refresh])

    const Inschrijvingen = memo(()=>{
        const { register, handleSubmit, formState: {errors} } = useForm();
        return <form className='grid flex-w justify fullwidth' onSubmit={handleSubmit(updateInschrijvingen)}>
            <label className='acclabel'>{prijzen[0].naam}</label>
            <input className='accvalue inputfix' type='number' step={'any'} defaultValue={prijzen[0].waarde} {...register('comp',{required:'Dit is vereist'})} />
            {errors.comp && <><div className='acclabel'></div><p className='accvalue error'>{errors.comp.message}</p></>}
            <label className='acclabel'>{prijzen[1].naam}</label>
            <input className='accvalue inputfix' type='number' step={'any'} defaultValue={prijzen[1].waarde} {...register('recreant',{required:'Dit is vereist'})} />
            {errors.recreant && <><div className='acclabel'></div><p className='accvalue error'>{errors.recreant.message}</p></>}
            <label className='acclabel'>{prijzen[2].naam}</label>
            <input className='accvalue inputfix' type='number' step={'any'} defaultValue={prijzen[2].waarde} {...register('jeugd',{required:'Dit is vereist'})} />
            {errors.jeugd && <><div className='acclabel'></div><p className='accvalue error'>{errors.jeugd.message}</p></>}
            <button className='wwwijzig' disabled={loading}>Bevestigen</button>
        </form>
    })

    if (prijzen)
    return <>
        <button className='backbutton margin20' onClick={back}>{'<'} Terug</button>
        {customError ? (<p className="error">{customError}</p>): null}
        <Inschrijvingen />
    </>
    return <><button className='backbutton' onClick={back}>{'<'} Terug</button><p>Loading...</p></>
}