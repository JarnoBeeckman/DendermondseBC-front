import { memo, useCallback, useEffect, useState } from 'react'
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
    const [selected,setSelected] = useState([])
    const back = useCallback(async()=>{
        history.push('/settings')
    },[history])

    const refresh = useCallback(async ()=>{
        setLoading(true)
        const e = await api.getConfig()
        if (e === 404) setCustomError('Kon groepen niet laden')
        else {
            setConfig(e[0])
            setSelected(e[0].list)
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

    const updateList = useCallback(async ()=>{
        setLoading(true)
        setCustomError('')
        const e = await api.updateList(selected)
        if (!e) setCustomError('Kon lijst niet updaten')
        else await refresh()
        setLoading(false)
    },[selected,refresh])

    const filter = useCallback((id)=>{
        const e = selected
        if (e.length !== 1) {
             e.splice(e.indexOf(id),1)
             setSelected([...e])
        } else
         setSelected([])
    },[selected])

    const Selection = memo(()=>{
        return <>
            <p>Data te importeren: </p>
            <div className='grid flex-w justify fullwidth'>
                <label className='acclabel'>E-mail: </label>
                <input className='accvalue height20' type='checkbox' checked={selected.includes('mail')} onChange={()=>null} onClick={()=>selected.includes('mail') ? filter('mail') : setSelected([...selected,'mail'])} />
                <label className='acclabel'>Voornaam: </label>
                <input className='accvalue height20' type='checkbox' checked={selected.includes('voornaam')} onChange={()=>null} onClick={()=>selected.includes('voornaam') ? filter('voornaam') : setSelected([...selected,'voornaam'])} />
                <label className='acclabel'>Achternaam: </label>
                <input className='accvalue height20' type='checkbox' checked={selected.includes('achternaam')} onChange={()=>null} onClick={()=>selected.includes('achternaam') ? filter('achternaam') : setSelected([...selected,'achternaam'])} />
                <label className='acclabel'>Adres: </label>
                <input className='accvalue height20' type='checkbox' checked={selected.includes('adres')} onChange={()=>null} onClick={()=>selected.includes('adres') ? filter('adres') : setSelected([...selected,'adres'])} />
                <label className='acclabel'>Postcode: </label>
                <input className='accvalue height20' type='checkbox' checked={selected.includes('postcode')} onChange={()=>null} onClick={()=>selected.includes('postcode') ? filter('postcode') : setSelected([...selected,'postcode'])} />
                <label className='acclabel'>Woonplaats: </label>
                <input className='accvalue height20' type='checkbox' checked={selected.includes('woonplaats')} onChange={()=>null} onClick={()=>selected.includes('woonplaats') ? filter('woonplaats') : setSelected([...selected,'woonplaats'])} />
                <label className='acclabel'>Geslacht: </label>
                <input className='accvalue height20' type='checkbox' checked={selected.includes('geslacht')} onChange={()=>null} onClick={()=>selected.includes('geslacht') ? filter('geslacht') : setSelected([...selected,'geslacht'])} />
                <label className='acclabel'>Geboortedatum: </label>
                <input className='accvalue height20' type='checkbox' checked={selected.includes('geboortedatum')} onChange={()=>null} onClick={()=>selected.includes('geboortedatum') ? filter('geboortedatum') : setSelected([...selected,'geboortedatum'])} />
                <label className='acclabel'>Gsm-nummer: </label>
                <input className='accvalue height20' type='checkbox' checked={selected.includes('gsm')} onChange={()=>null} onClick={()=>selected.includes('gsm') ? filter('gsm') : setSelected([...selected,'gsm'])} />
                <label className='acclabel'>Spelertype: </label>
                <input className='accvalue height20' type='checkbox' checked={selected.includes('status')} onChange={()=>null} onClick={()=>selected.includes('status') ? filter('status') : setSelected([...selected,'status'])} />
                <label className='acclabel'>Niveau enkel: </label>
                <input className='accvalue height20' type='checkbox' checked={selected.includes('enkel')} onChange={()=>null} onClick={()=>selected.includes('enkel') ? filter('enkel') : setSelected([...selected,'enkel'])} />
                <label className='acclabel'>Niveau dubbel: </label>
                <input className='accvalue height20' type='checkbox' checked={selected.includes('dubbel')} onChange={()=>null} onClick={()=>selected.includes('dubbel') ? filter('dubbel') : setSelected([...selected,'dubbel'])} />
                <label className='acclabel'>Niveau mix: </label>
                <input className='accvalue height20' type='checkbox' checked={selected.includes('mix')} onChange={()=>null} onClick={()=>selected.includes('mix') ? filter('mix') : setSelected([...selected,'mix'])} />
                <button className='wwwijzig' disabled={loading} onClick={updateList}>Bevestigen</button>
            </div>
        </>
    })

    const Pairings = memo(()=>{
        return <><p>Excel kolommen: </p>
        <form className='grid flex-w justify fullwidth' onSubmit={handleSubmit(updateConfig)}>
        <label className='acclabel'>Lidnummer: </label>
            <input className='accvalue inputfix' defaultValue={config.bvid} {...register('bvid',{required:'Dit is vereist'})} />
            {errors.bvid && <><div className='acclabel'></div><p className='accvalue error'>{errors.bvid.message}</p></>}
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
            <label className='acclabel'>Spelertype: </label>
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
    })

    if (config)
    return <>
        <button className='backbutton margin20' onClick={back}>{'<'} Terug</button>
        {customError ? (<p className="error">{customError}</p>): null}
        <Selection/>
        <div className='fullwidth margin20' />
        <Pairings/>
    </>
    return <><button className='backbutton' onClick={back}>{'<'} Terug</button><p>Loading...</p></>
}