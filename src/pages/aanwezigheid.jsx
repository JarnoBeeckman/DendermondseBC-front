import { useCallback, useEffect, useState } from "react";
import { useSession } from "../context/AuthProvider"
import { useHistory } from "react-router-dom";
import { getAanwezigheden,updateAanwezigheden } from "../api/training";

export default function Aanwezigheden() {
    const {ready} = useSession()
    const [customError,setCustomError] = useState(null)
    const [loading,setLoading] = useState()
    const [leden,setLeden] = useState()
    const [aanwezighedn,setAanwezigheden] = useState()
    const [toberemoved,setToberemoved] = useState([])
    const [tobeadded,setTobeadded] = useState([])

    const history = useHistory()
    const back = useCallback(async ()=>{
        history.push('/trainings')
    },[history])

    const param = new URLSearchParams(window.location.search)
    const [key] = useState(param.get("key"))

    const refresh = useCallback(async ()=>{
        setCustomError(null)
        setLoading(true)
        const e = await getAanwezigheden(key)
        if (e === 404) setCustomError('Kon aanwezigheden niet laden')
        else {
            setLeden(e?.leden)
            setAanwezigheden(e?.aanwezigheden)
        } 
        setLoading(false)
    },[key])

    useEffect( ()=>{
        if (ready) {
            refresh()
        }
    },[ready,refresh])

    const save = useCallback(async ()=>{
        setLoading(true)
        setCustomError(null)
        if (tobeadded.length !== 0 || toberemoved.length !== 0) {
        const e = await updateAanwezigheden(key,{tobeadded,toberemoved})
        if (e === 404) setCustomError('Kon aanwezigheden niet opslaan')
        else {
            await back()
        }
    } else await back()
    },[key,tobeadded,toberemoved,back])

    const handleClick = useCallback((id)=>{
        if (toberemoved.includes(id)) {
            setToberemoved(toberemoved.filter(a=>a!==id))
            if (!aanwezighedn.includes(id)) setTobeadded([...tobeadded,id])
        } else if (tobeadded.includes(id)) {
            setTobeadded(tobeadded.filter(a=>a!==id))
        } else if (aanwezighedn.includes(id)) {
            setToberemoved([...toberemoved,id])
        } else {
            setTobeadded([...tobeadded,id])
        }
    },[tobeadded,toberemoved,aanwezighedn])

    return <>
        <button className='backbutton margin20' onClick={back}>{'<'} Terug</button>
        {loading && <div>Loading...</div>}
        {customError && <div className='error'>{customError}</div>}

        {Array.isArray(leden) && leden ? 
             <div className='grid flex-w justify fullwidth'>
                {leden.map(l=>{
                    return <div className="lidlijst fullwidth center" onClick={()=>handleClick(l.id)} style={(aanwezighedn?.includes(l.id) || tobeadded.includes(l.id)) && !toberemoved.includes(l.id) ? {backgroundColor:"lightgreen"} : {backgroundColor:"red"}} key={l.id}>{`${l.achternaam} ${l.voornaam}`}</div>
                })}
                <button disabled={loading} className="wwwijzig" onClick={()=>save()}>Opslaan</button>
            </div>
        :null}
    </>
}