import { memo, useCallback, useEffect, useState } from 'react'
import {useHistory} from 'react-router-dom'
import {useSession} from '../context/AuthProvider'
import * as groep from '../api/groep'
import { useForm } from "react-hook-form"

export default function GroepConfig() {

    const [groepen,setGroepen]=useState()
    const [selected,setSelected]=useState()
    const [customError,setCustomError]=useState();
    const [add,setAdd] = useState(false)
    const {ready,loading} = useSession()
    const history = useHistory()
    const back = useCallback(async()=>{
        history.push('/settings')
    },[history])

    const refresh = useCallback(async ()=>{
        const e = await groep.getAll()
        if (e === 404) setCustomError('Kon groepen niet laden')
        else setGroepen(e)
    },[])

    useEffect(()=>{
        if (ready)
            refresh()
    },[ready,refresh])

    const update = useCallback(async ({groepnaam,kleur})=>{
        const e = await groep.updateById(selected.id,groepnaam,kleur)
        if (!e) setCustomError('Kon wijziging niet uitvoeren')
        else {
            await refresh()
            setCustomError(null)
        } 
    },[selected,refresh])
    const addGroep = useCallback(async ({groepnaam,kleur})=>{
        const e = await groep.create(groepnaam,kleur)
        if (!e) setCustomError('Kon groep niet aanmaken')
        else {
            await refresh()
            setAdd(false)
        }
    },[refresh])
    const del = useCallback(async ()=>{
        const e = await groep.deleteById(selected.id)
        if (!e) setCustomError('Kan groep niet verwijderen, zitten er nog leden in?')
        else await refresh()
    },[refresh,selected?.id])

    const Groep = memo((props)=>{

        return (<><div className={`lidlijst ${selected?.id === props.ob.id ? 'lidselected' : ''}`} onClick={()=>{selected?.id === props.ob.id ? setSelected(null) : setSelected(props.ob)}}>
            <div className="fullwidth center flex">{props.ob.groepnaam}</div>
            </div>
            {selected?.id === props.ob.id ? (<Edit ob={props.ob}/>) : null}
            </>)
    })

    const Edit = memo((props)=>{
        const { register, handleSubmit, formState: {errors} } = useForm();
        return (<>
            <form className='lidedit accgrid' onSubmit={handleSubmit(update)}>
                <div className='lidattribuut'>
                    <div className='acclabel '>Naam: </div>
                    <input className='textcenter accvalue' type='text' placeholder='Naam' defaultValue={props.ob.groepnaam} {...register('groepnaam',{required: 'Dit is vereist'})}></input>
                    {errors.groepnaam && <><div className='acclabel'></div><p className='accvalue error'>{errors.groepnaam.message}</p></>}
                </div>
                <div className='lidattribuut'>
                    <div className='acclabel'>Kleur: </div>
                    <input className='accvalue' type='color' defaultValue={props.ob.kleur} {...register('kleur',{required: 'Dit is vereist'})}></input>
                    {errors.kleur && <><div className='acclabel'></div><p className='accvalue error' >{errors.kleur.message}</p></>}
                </div>
                <button className='wwwijzig halfwidth' type='submit' disabled={loading}>Bevestigen</button>
                <button className='wwwijzig delete halfwidth' disabled={loading} onClick={()=>del()}>Verwijderen</button>
            </form>
            
        </>)
    })
    const Addnew = memo(()=>{
        const { register, handleSubmit, formState: {errors} } = useForm();
        return (
            <>
                <form className='grid flex-w accgrid' onSubmit={handleSubmit(addGroep)}>
                <label className='acclabel'>Naam: </label>
                   <input className='accvalue' type='text' placeholder='naam' {...register('groepnaam',{required: 'Dit is vereist'})} />
                   {errors.groepnaam && <><div className='acclabel'></div><p className='accvalue error'>{errors.groepnaam.message}</p></>}
                   <label className='acclabel'>Kleur: </label>
                   <input className='accvalue' type='color' placeholder='username' {...register('kleur',{required: 'Dit is vereist'})} />
                   {errors.kleur && <><div className='acclabel'></div><p className='accvalue error'>{errors.kleur.message}</p></>}
                   <button className='wwwijzig' type='submit' disabled={loading}>Bevestigen</button>
                </form>
            </>
        )
    })

    if (groepen && ready) {
        if (!add)
        return (
        <>
            <button className='backbutton' onClick={back}>{'<'} Terug</button>
            {customError ? (<p className="error">{customError}</p>): null}
            
                {groepen.map(x=>{
                    return <Groep key={x.id} ob={x}/>
                })}
                <div className='margin20'></div>
            <button className='wwwijzig' onClick={()=>setAdd(true)}>Nieuwe groep</button>
        </>
    ); else return (<>
        <button className='backbutton' onClick={()=>setAdd(false)}>{'<'} Terug</button>
        <Addnew/>
    </>)
            }
    return <><button className='backbutton' onClick={back}>{'<'} Terug</button><div>Loading...</div></>
}