import { useHistory } from "react-router-dom";
import { useCallback, useEffect, useState, memo } from 'react';
import * as betaling from '../api/betaling'
import { useSession } from "../context/AuthProvider"
import {RiDeleteBin6Line} from 'react-icons/ri'
import {GrAdd} from 'react-icons/gr'

export default function Betalingen() {

    const [soorten,setSoorten] = useState()
    const [loading,setLoading] = useState()
    const [leden,setLeden] = useState()
    const [selected,setSelected] =  useState('0')
    const [customError,setCustomError] = useState()
    const {ready } = useSession()
    const history = useHistory()

    const back = useCallback(async ()=>{
        history.push('/')
    },[history])

    const refreshSoorten = useCallback(async ()=>{
        const e = await betaling.getAll()
        if (e === 404) setCustomError('Kon groepen niet laden')
        else setSoorten(e)
    },[])

    const refresh = useCallback(async ()=>{
        const e = await betaling.getAllBetalingen()
        if (!e) setCustomError('Kon leden niet laden')
        else setLeden(e)
        setLoading(false)
    },[])

    const filterLeden = useCallback((w,reversed)=>{
        if (Array.isArray(w.bid)){
            if (!reversed)
            return w.bid.includes(parseInt(selected))
            return !w.bid.includes(parseInt(selected))
        }
        if (!reversed) 
        return w.bid === parseInt(selected)
        return w.bid !== parseInt(selected)
    },[selected]) 

    useEffect( ()=>{
        if (ready) {
            refreshSoorten()
            refresh()
        }
    },[ready,refreshSoorten,refresh])

    const link = useCallback(async (bid,id)=>{
        setLoading(true)
        const e = await betaling.link(bid,id)
        if (!e) setCustomError('Kon lid niet toevoegen')
        else {
            await refresh()
            setCustomError(null)
        } 
    },[refresh])

    const unlink = useCallback(async (bid,id)=>{
        setLoading(true)
        const e = await betaling.unlink(bid,id)
        if (!e) setCustomError('Kon lid niet verwijderen')
        else {
            await refresh()
            setCustomError(null)
        }
    },[refresh])

    const Lid = memo((props)=>{
        return (<>
            <div className="lidlijst center nocursor">
                    <button className={`wwwijzig width20 margin0 ${props.del ? 'delete':null} ${props.none ? 'hidden':null}`}
                     disabled={loading} onClick={props.del ? ()=>unlink(selected,props.x.id) : ()=>link(selected,props.x.id) } >{props.del ?<RiDeleteBin6Line/>:<GrAdd/>}</button>
                    <div className="flex center">{`${props.x.voornaam} ${props.x.achternaam}`}</div>
                </div>
       </> )
    })

    const Filtered = memo((props)=>{
        let temp = []
        if (selected !== '0') {
           if (!props.reversed) {
                temp = leden.filter(x=>filterLeden(x,false))
                return (<>{temp.map(x=>{
                    return <Lid key={x.id} x={x} del={true} />
                })}</>)
            }
            else {
                temp = leden.filter(x=>filterLeden(x,true))
                return (<>{temp.map(x=>{
                    return <Lid key={x.id} x={x} />
                })}</>)
            }
        }
        temp = leden.filter(x=>!x.bid)
        return (<>{temp.map(x=>{return <Lid key={x.id} x={x} none={true}/>})}</>)
    })


    if (soorten && leden) {
        return <>
            <button className='backbutton margin20' onClick={back}>{'<'} Terug</button>
            {customError ? (<p className="error">{customError}</p>): null}
                <div className="fullwidth center flex">
                    <select onChange={e=>setSelected(e.target.value)} defaultValue={selected}>
                        <option value={0}>Geen</option>
                        {soorten.map(x=>{
                        if (x.actief !== 0)
                        return <option key={x.bid} value={x.bid}>{x.naam}</option>
                        return null
                        })}
                    </select>
                </div>
            <div className="margin20"/>
            <Filtered/>
            {selected!=='0' ? <><div className="margin20 line grid"/><Filtered reversed={true}/></> :null}
        </>
    }
    return <><button className='backbutton' onClick={back}>{'<'} Terug</button><div>Loading...</div></>
}