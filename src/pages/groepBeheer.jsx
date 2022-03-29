import { useHistory } from "react-router-dom";
import { useCallback, useEffect, useState, memo } from 'react';
import * as groep from '../api/groep'
import { useGetAllLeden, useSession } from "../context/AuthProvider"
import {RiDeleteBin6Line} from 'react-icons/ri'

export default function GroepBeheer() {

    const [groepen,setGroepen] = useState()
    const [loading,setLoading] = useState()
    const [leden,setLeden] = useState()
    const [selected,setSelected] =  useState('0')
    const [customError,setCustomError] = useState()
    const {ready } = useSession()
    const history = useHistory()
    const getAll = useGetAllLeden()

    const back = useCallback(async ()=>{
        history.push('/')
    },[history])

    const refreshGroepen = useCallback(async ()=>{
        const e = await groep.getAll()
        if (e === 404) setCustomError('Kon groepen niet laden')
        else setGroepen(e)
    },[])

    const refresh = useCallback(async ()=>{
        const e = await getAll()
        if (!e) setCustomError('Kon leden niet laden')
        else setLeden(e)
        setLoading(false)
    },[getAll])

    const filterLeden = useCallback((w)=>{
        if (Array.isArray(w.gid)){
            return w.gid.includes(parseInt(selected))
        } 
        return w.gid === parseInt(selected)
    },[selected]) 

    useEffect( ()=>{
        if (ready) {
            refreshGroepen()
            refresh()
        }
    },[ready,refreshGroepen,refresh])

    const Lid = memo((props)=>{
        let list = []
        if (Array.isArray(props.x.kleur))
            props.x.kleur.forEach(a=>list.push(a))
        else list.push(props.x.kleur)
        return (<>
            <div className="lidlijst center nocursor">
                    <button className={`wwwijzig width20 margin0 ${props.del ? 'delete':null} ${props.none ? 'hidden':null}`} disabled={loading}>{props.del ?<RiDeleteBin6Line/>:null}</button>
                    <div className="flex center">{`${props.x.voornaam} ${props.x.achternaam}`}</div>
                    <div className="circles">
                {list ? list.map(x=>{
                    return (<div className="circle" key={x} style={{backgroundColor: x,marginRight: '5px'}}/>)
                }) : ''}
            </div>
                </div>
       </> )
    })

    const Filtered = memo(()=>{
        let temp = []
        if (selected !== '0') {
         temp = leden.filter(filterLeden)
        return (<>{temp.map(x=>{
            return <Lid key={x.id} x={x} del={true} />
        })}</>)
        }
        temp = leden.filter(x=>!x.gid)
        return (<>{temp.map(x=>{return <Lid key={x.id} x={x} none={true}/>})}</>)
    })
    
    if (groepen && leden)
    return (
        <>
            <button className='backbutton margin20' onClick={back}>{'<'} Terug</button>
            {customError ? (<p className="error">{customError}</p>): null}
                <div className="fullwidth">
                    <select onChange={e=>setSelected(e.target.value)} defaultValue={selected}>
                        <option value={0}>Geen</option>
                        {groepen.map(x=>{
                        return <option key={x.gid} value={x.gid}>{x.groepnaam}</option>
                        })}
                    </select>
                </div>
            <div className="margin20"/>
            <Filtered/>
        </>
    )
    return <><button className='backbutton' onClick={back}>{'<'} Terug</button><div>Loading...</div></>
}