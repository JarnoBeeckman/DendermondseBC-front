import { useCallback, useEffect, useState } from 'react'
import {useHistory} from 'react-router-dom'
import {useSession} from '../../context/AuthProvider'
import * as api from '../../api/import'
import { useForm } from "react-hook-form"

export default function ImportConfig() {
    const [loading,setLoading] = useState()
    const [config,setConfig] = useState()
    const {ready} = useSession()
    const { register, handleSubmit, formState: {errors} } = useForm();
    const history = useHistory()
    const [customError,setCustomError]=useState();
    const back = useCallback(async()=>{
        history.push('/settings')
    },[history])

    const refresh = useCallback(async ()=>{
        setLoading(true)
        const e = await api.getConfig()
        if (e === 404) setCustomError('Kon groepen niet laden')
        else {
            setConfig(e[0])
            setCustomError(null)
        } 
        setLoading(false)
    },[])

    useEffect(()=>{
        if (ready)
            refresh()
    },[ready,refresh])

    const updateConfig = useCallback(async (object)=>{
        setLoading(true)
        setCustomError('')
        const e = await api.updateConfig(object)
        if (!e) setCustomError('Kon config niet bijwerken')
        else await refresh()
        setLoading(false)
    },[refresh])

    if (config)
    return <>
        <button className='backbutton margin20' onClick={back}>{'<'} Terug</button>
        {customError ? (<p className="error">{customError}</p>): null}
        <p>Excel kolommen: </p>
        <form className='grid flex-w justify fullwidth' onSubmit={handleSubmit(updateConfig)}>
            <label className='acclabel'>E-mail: </label>
            <input className='accvalue inputfix' defaultValue={config.mail} {...register('mail',{required:'Dit is vereist'})} />
            {errors.mail && <><div className='acclabel'></div><p className='accvalue error'>{errors.mail.message}</p></>}
            <label className='acclabel'>Voornaam: </label>
            <input className='accvalue inputfix' defaultValue={config.voornaam} {...register('voornaam',{required:'Dit is vereist'})} />
            {errors.voornaam && <><div className='acclabel'></div><p className='accvalue error'>{errors.voornaam.message}</p></>}
            <label className='acclabel'>Achternaam: </label>
            <input className='accvalue inputfix' defaultValue={config.achternaam} {...register('achternaam',{required:'Dit is vereist'})} />
            {errors.achternaam && <><div className='acclabel'></div><p className='accvalue error'>{errors.achternaam.message}</p></>}
            <label className='acclabel'>Adres: </label>
            <input className='accvalue inputfix' defaultValue={config.adres} {...register('adres',{required:'Dit is vereist'})} />
            {errors.adres && <><div className='acclabel'></div><p className='accvalue error'>{errors.adres.message}</p></>}
            <label className='acclabel'>Postcode: </label>
            <input className='accvalue inputfix' defaultValue={config.postcode} {...register('postcode',{required:'Dit is vereist'})} />
            {errors.postcode && <><div className='acclabel'></div><p className='accvalue error'>{errors.postcode.message}</p></>}
            <label className='acclabel'>Woonplaats: </label>
            <input className='accvalue inputfix' defaultValue={config.woonplaats} {...register('woonplaats',{required:'Dit is vereist'})} />
            {errors.woonplaats && <><div className='acclabel'></div><p className='accvalue error'>{errors.woonplaats.message}</p></>}
            <label className='acclabel'>Geslacht: </label>
            <input className='accvalue inputfix' defaultValue={config.geslacht} {...register('geslacht',{required:'Dit is vereist'})} />
            {errors.geslacht && <><div className='acclabel'></div><p className='accvalue error'>{errors.geslacht.message}</p></>}
            <label className='acclabel'>Geboortedatum: </label>
            <input className='accvalue inputfix' defaultValue={config.geboortedatum} {...register('geboortedatum',{required:'Dit is vereist'})} />
            {errors.geboortedatum && <><div className='acclabel'></div><p className='accvalue error'>{errors.geboortedatum.message}</p></>}
            <label className='acclabel'>Gsm-nummer: </label>
            <input className='accvalue inputfix' defaultValue={config.gsm} {...register('gsm',{required:'Dit is vereist'})} />
            {errors.gsm && <><div className='acclabel'></div><p className='accvalue error'>{errors.gsm.message}</p></>}
            <label className='acclabel'>Status: </label>
            <input className='accvalue inputfix' defaultValue={config.status} {...register('status',{required:'Dit is vereist'})} />
            {errors.status && <><div className='acclabel'></div><p className='accvalue error'>{errors.status.message}</p></>}
            <label className='acclabel'>Niveau enkel: </label>
            <input className='accvalue inputfix' defaultValue={config.enkel} {...register('enkel',{required:'Dit is vereist'})} />
            {errors.enkel && <><div className='acclabel'></div><p className='accvalue error'>{errors.enkel.message}</p></>}
            <label className='acclabel'>Niveau dubbel: </label>
            <input className='accvalue inputfix' defaultValue={config.dubbel} {...register('dubbel',{required:'Dit is vereist'})} />
            {errors.dubbel && <><div className='acclabel'></div><p className='accvalue error'>{errors.dubbel.message}</p></>}
            <label className='acclabel'>Niveau mix: </label>
            <input className='accvalue inputfix' defaultValue={config.mix} {...register('mix',{required:'Dit is vereist'})} />
            {errors.mix && <><div className='acclabel'></div><p className='accvalue error'>{errors.mix.message}</p></>}
            <button className='wwwijzig' type='submit' disabled={loading}>Bevestigen</button>
        </form>
    </>
    return <><button className='backbutton' onClick={back}>{'<'} Terug</button><p>Loading...</p></>
}