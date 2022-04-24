import { memo, useCallback, useEffect, useState } from 'react'
import {useHistory} from 'react-router-dom'
import {useSession} from '../../context/AuthProvider'
import * as betaling from '../../api/betaling'
import { useForm } from "react-hook-form"
import {RiDeleteBin6Line} from 'react-icons/ri'

export default function BetalingConfig() {

    const [soorten,setSoorten ] = useState()
    const [selected,setSelected]=useState()
    const [customError,setCustomError]=useState();
    const [add,setAdd] = useState(false)
    const [loading,setLoading] = useState()
    const {ready} = useSession()
    const history = useHistory()
    const back = useCallback(async()=>{
        history.push('/settings')
    },[history])

    const refresh = useCallback(async ()=>{
        setLoading(true)
        const e = await betaling.getAll()
        if (e === 404) setCustomError('Kon groepen niet laden')
        else {
            setSoorten(e)
            setCustomError(null)
        } 
        setLoading(false)
    },[])

    useEffect(()=>{
        if (ready)
            refresh()
    },[ready,refresh])

    const update = useCallback(async ({naam,inschrijving,actief})=>{
        setLoading(true)
        const e = await betaling.updateById(selected.bid,naam,inschrijving ? true : false,actief ? true : false)
        if (!e) setCustomError('Kon wijziging niet uitvoeren')
        else {
            await refresh()
            setCustomError(null)
        } ; setLoading(false)
    },[selected,refresh])
    const addGroep = useCallback(async ({naam,inschrijving,actief})=>{
        setLoading(true)
        const e = await betaling.create(naam,inschrijving ? true : false,actief ? true : false)
        if (!e) setCustomError('Kon betalingssoort niet aanmaken')
        else {
            await refresh()
            setAdd(false)
            setCustomError(null)
        }; setLoading(false)
    },[refresh])
    const del = useCallback(async ()=>{
        setLoading(true)
        const e = await betaling.deleteById(selected.bid)
        if (!e) setCustomError('Kan betaling niet verwijderen, zitten er nog leden in?')
        else{
            await refresh()
            setCustomError(null)
        } ; setLoading(false)
    },[refresh,selected])

    const Soort = memo((props)=>{
        return (<><div className={`lidlijst ${selected?.bid === props.ob.bid ? 'lidselected' : ''}`} onClick={()=>{selected?.bid === props.ob.bid ? setSelected(null) : setSelected(props.ob)}}>
            <div className=" center flex">{props.ob.naam}</div> {selected?.bid === props.ob.bid ? (<button className='wwwijzig delete width40 margin0' disabled={loading} onClick={()=>del()}><RiDeleteBin6Line/></button>): null}
            </div>
            {selected?.bid === props.ob.bid ? (<Edit ob={props.ob}/>) : null}
            </>)
    })

    const Edit = memo((props)=>{
        const { register, handleSubmit, formState: {errors} } = useForm();
        return (<>
            <form className='lidedit accgrid' onSubmit={handleSubmit(update)}>
                <div className='lidattribuut'>
                    <div className='acclabel '>Naam: </div>
                    <input className='textcenter accvalue' type='text' placeholder='Naam' defaultValue={props.ob.naam} {...register('naam',{required: 'Dit is vereist'})}></input>
                    {errors.groepnaam && <><div className='acclabel'></div><p className='accvalue error'>{errors.groepnaam.message}</p></>}
                </div>
                <div className='lidattribuut'>
                    <div className='acclabel'>Inschrijving: </div>
                    <input className='accvalue' type='checkbox' defaultChecked={props.ob.inschrijving} {...register('inschrijving')}/>
                </div>
                <div className='lidattribuut'>
                    <div className='acclabel'>Actief: </div>
                    <input className='accvalue' type='checkbox' defaultChecked={props.ob.actief} {...register('actief')}/>
                </div>
                <div className='lidattribuut'></div>
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
                   <input className='accvalue' type='text' placeholder='naam' {...register('naam',{required: 'Dit is vereist'})} />
                   {errors.groepnaam && <><div className='acclabel'></div><p className='accvalue error'>{errors.groepnaam.message}</p></>}
                   <label className='acclabel'>Inschrijving: </label>
                   <input className='accvalue' type='checkbox' {...register('inschrijving')}/>
                   <label className='acclabel'>Actief: </label>
                   <input className='accvalue' type='checkbox' defaultChecked={true} {...register('actief')} />
                   <button className='wwwijzig' type='submit' disabled={loading}>Bevestigen</button>
                </form>
            </>
        )
    })

    if (soorten && ready) {
        if (!add) {
            return <>
            <button className='backbutton' onClick={back}>{'<'} Terug</button>
            {customError ? (<p className="error">{customError}</p>): null}
            
                {soorten.map(x=>{
                    return <Soort key={x.bid} ob={x}/>
                })}
                <div className='margin20'></div>
            <button className='wwwijzig' onClick={()=>setAdd(true)} disabled={loading}>Nieuwe soort</button>
            </>
        }
        return <>
        <button className='backbutton' onClick={()=>setAdd(false)}>{'<'} Terug</button>
        <Addnew />
        </>
    }
    return <><button className='backbutton' onClick={back}>{'<'} Terug</button><div>Loading...</div></>
}