import { useHistory } from "react-router-dom";
import { useCallback, useEffect, useState, memo } from 'react';
import * as betaling from '../api/betaling'
import { useSession } from "../context/AuthProvider"
import {RiDeleteBin6Line} from 'react-icons/ri'
import { useForm } from "react-hook-form"

const toDateInputString = (date) => {
    // (toISOString returns something like 2020-12-05T14:15:74Z,
    // date HTML5 input elements expect 2020-12-05
    // 
    if (!date) return null;
    if (typeof date !== Object) {
        date = new Date(date);
    }
    const asString = date.toISOString();
    return asString.substring(0, asString.indexOf("T"));
};

export default function Betalingen() {

    const [soorten,setSoorten] = useState()
    const [add,setAdd] = useState(false)
    const [loading,setLoading] = useState()
    const [betalingen,setBetalingen] = useState()
    const [clicked,setClicked] = useState()
    const [leden,setLeden] = useState()
    const [selected,setSelected] =  useState('none')
    const [customError,setCustomError] = useState()
    const [addlid,setAddlid] = useState(0)
    const [prijzen,setPrijzen] = useState()
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
        else {
            setLeden(e.leden)
            setBetalingen(e.data)
            setPrijzen(e.prijzen)
        } 
        setLoading(false)
    },[])

    const filterLeden = useCallback((w,reversed)=>{
        if (Array.isArray(w.bid)){
            if (!reversed)
            return w.bid === parseInt(soorten[selected].bid)
            return w.bid !== parseInt(selected)
        }
        if (!reversed) 
        return w.bid === parseInt(soorten[selected].bid)
        return w.bid !== parseInt(selected)
    },[selected,soorten]) 

    useEffect( ()=>{
        if (ready) {
            refreshSoorten()
            refresh()
        }
    },[ready,refreshSoorten,refresh])

    const link = useCallback(async ({prijs,datum})=>{
        setLoading(true)
        const e = await betaling.link(soorten[selected].bid,leden[addlid].id,prijs,datum)
        if (!e) setCustomError('Kon betaling niet toevoegen')
        else {
            await refresh()
            setCustomError(null)
            setAdd(false)
        } 
        setLoading(false)
    },[refresh,selected,addlid,leden,soorten])

    const unlink = useCallback(async (id)=>{
        setLoading(true)
        const e = await betaling.unlink(id)
        if (!e) setCustomError('Kon betaling niet verwijderen')
        else {
            await refresh()
            setCustomError(null)
        }
        setLoading(false)
    },[refresh])

    const Lid = memo((props)=>{
        return (<>
            <div className={`lidlijst center ${props.x === clicked ? 'lidselected' : ''}`} onClick={()=>{props.x === clicked ? setClicked(null) : setClicked(props.x)}}>
                    <button className={`wwwijzig width20 margin0 delete ${props.x === clicked ? null : 'hidden'}`}
                     disabled={loading} onClick={()=>unlink(props.x.beid) } ><RiDeleteBin6Line/></button>
                    <div className="flex center">{`${props.x.achternaam} ${props.x.voornaam}`}</div>
                    <div className="circles lidstatus">
                        {'€'+props.x.prijs}
                    </div>
                </div>
            {props.x === clicked ? <Edit x={props.x}/> : null}
       </> )
    })

    const Edit = memo((props)=>{
        return <div className="lidedit">
            <div className="lidattribuut">
                <div className="acclabel">Prijs: </div>
                <div className="accvalue">{'€'+props.x.prijs}</div>
            </div>
            <div className="lidattribuut">
                <div className="acclabel">Datum: </div>
                <div className="accvalue">{toDateInputString(props.x.datum)}</div>
            </div>
        </div>
    })

    const Filtered = memo(()=>{
        let temp = []
        if (selected !== 'none') {
                temp = betalingen.filter(x=>filterLeden(x,false))
                return (<><button className="wwwijzig" disabled={loading} onClick={()=>setAdd(true)}>Nieuwe betaling</button><div className="margin20"/>{temp.map(x=>{
                    return <Lid key={x.beid} x={x} />
                })}</>)
        }
        return null
    })

    const Addnew = memo(()=>{
        const { register, handleSubmit, formState: {errors} } = useForm();
        
        return (
            <>
                <div className='grid flex-w accgrid'>
                <label className='acclabel'>Naam: </label>
                   <select className='accvalue' onChange={e=>setAddlid(e.target.value)} value={addlid}>
                        {leden.map(x=>{
                            return <option key={x.id} value={leden.indexOf(x)}>{`${x.achternaam} ${x.voornaam}`}</option>
                        })}
                   </select>
                   </div>
                   <form className=" grid flex-w accgrid margin0" onSubmit={handleSubmit(link)}>
                   <label className='acclabel'>Aantal: </label>
                   <input className='accvalue' type='number' step={'any'} {...register('prijs',{required: 'Dit is vereist'})} />
                   {soorten[selected].inschrijving === 1 ? (<><div className="accvalue alignright fullwidth">{
                       `${leden[addlid].status}: ${prijzen.find(x=>x.naam===leden[addlid].status)?.aantal}`
                   }</div></>) : null}
                   {errors.prijs && <><div className='acclabel'></div><p className='accvalue error'>{errors.prijs.message}</p></>}
                   <label className='acclabel'>Datum: </label>
                   <input className='accvalue' type='date' defaultValue={toDateInputString(Date.now())} {...register('datum')} />
                   {errors.datum && <><div className='acclabel'></div><p className='accvalue error'>{errors.datum.message}</p></>}
                   <button className='wwwijzig' type='submit' disabled={loading}>Bevestigen</button>
                   </form>
            </>
        )
    })

    if (soorten && leden) {
        if (!add)
        return <>
            <button className='backbutton margin20' onClick={back}>{'<'} Terug</button>
            {customError ? (<p className="error">{customError}</p>): null}
                <div className="fullwidth center flex">
                    <select onChange={e=>setSelected(e.target.value)} defaultValue={selected}>
                        <option value={'none'}>Geen</option>
                        {soorten.map(x=>{
                        if (x.actief !== 0)
                        return <option key={x.bid} value={soorten.indexOf(x)}>{x.naam}</option>
                        return null
                        })}
                    </select>
                </div>
            <div className="margin20"/>
            <Filtered/>
        </>
        return <>
            <button className='backbutton margin20' onClick={()=>setAdd(false)}>{'<'} Terug</button>
            {customError ? (<p className="error">{customError}</p>): null}
            <Addnew/>
        </>
    }
    return <><button className='backbutton' onClick={back}>{'<'} Terug</button><div>Loading...</div></>
}