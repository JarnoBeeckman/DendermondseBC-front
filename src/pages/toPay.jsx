import { useHistory } from "react-router-dom";
import { memo,useCallback, useEffect, useState } from 'react';
import {BsCheckLg} from 'react-icons/bs'
import { useSession } from "../context/AuthProvider"
import * as betaling from '../api/betaling'

export default function ToPay() {

    const history = useHistory();
    const [error,setError] = useState()
    const [list,setList] = useState()
    const {ready} = useSession()

    const back = useCallback(async ()=>{
        history.push('/')
    },[history]);

    const refresh = useCallback(async ()=>{
        const a = await betaling.getToPay()
        if (!a) setError('Er liep iets fout met ophalen van gegevens')
        else setList(a)
    },[])

    useEffect(()=>{
        if (ready) {
            refresh()
        }
    },[ready,refresh])

    const Lid = memo(props=>{
        return <div className="fullwidth flex-w justify grid" key={props.lid.id}><label className="acclabel">{props.lid.voornaam + ' ' + props.lid.achternaam}</label><div className="accvalue"><div className="flex-w justify">{props.lid.beid ? <BsCheckLg/> : 'X'}</div></div></div>
    })

    if (list)
    return <>
        <button className='backbutton margin20' onClick={back}>{'<'} Terug</button>
        {error ? (<p className="error">{error}</p>): null}
        {list.map(x=>{
            return <Lid lid={x} />
        })}
    </>
    return <><button className='backbutton margin20' onClick={back}>{'<'} Terug</button>{error ? (<p className="error">{error}</p>): <p>Loading...</p>}</>
}