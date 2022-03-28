import { memo, useCallback, useEffect, useState } from 'react'
import {useHistory} from 'react-router-dom'
import {useSession} from '../context/AuthProvider'
import * as groep from '../api/groep'
import { useForm } from "react-hook-form"
import {RiDeleteBin6Line} from 'react-icons/ri'

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
        else {
            setGroepen(e)
            setCustomError(null)
        } 
    },[])

    useEffect(()=>{
        if (ready)
            refresh()
    },[ready,refresh])

    const update = useCallback(async ({groepnaam,kleur})=>{
        const e = await groep.updateById(selected.gid,groepnaam,kleur)
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
            setCustomError(null)
        }
    },[refresh])
    const del = useCallback(async ()=>{
        const e = await groep.deleteById(selected.gid)
        if (!e) setCustomError('Kan groep niet verwijderen, zitten er nog leden in?')
        else{
            await refresh()
            setCustomError(null)
        } 
    },[refresh,selected])

    const Groep = memo((props)=>{
        let list = []
        if (Array.isArray(props.ob.kleur))
            props.ob.kleur.forEach(x=>list.push(x))
        else list.push(props.ob.kleur)
        return (<><div className={`lidlijst ${selected?.gid === props.ob.gid ? 'lidselected' : ''}`} onClick={()=>{selected?.gid === props.ob.gid ? setSelected(null) : setSelected(props.ob)}}>
            <div className=" center flex">{props.ob.groepnaam}</div> {selected?.gid === props.ob.gid ? (<button className='wwwijzig delete width40 margin0' disabled={loading} onClick={()=>del()}><RiDeleteBin6Line/></button>): <div className="circles">
                {list ? list.map(x=>{
                    return (<div className="circle" key={x} style={{backgroundColor: x,marginRight: '5px'}}/>)
                }) : ''}
            </div>}
            </div>
            {selected?.gid === props.ob.gid ? (<Edit ob={props.ob}/>) : null}
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
                <button className='wwwijzig' type='submit' disabled={loading}>Bevestigen</button>
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
                    return <Groep key={x.gid} ob={x}/>
                })}
                <div className='margin20'></div>
            <button className='wwwijzig' onClick={()=>setAdd(true)}>Nieuwe groep</button>
        </>
    ); else return (<>
        <button className='backbutton' onClick={()=>setAdd(false)}>{'<'} Terug</button>
        <Addnew />
    </>)
            }
    return <><button className='backbutton' onClick={back}>{'<'} Terug</button><div>Loading...</div></>
}