
import { useHistory } from "react-router-dom";
import { memo, useCallback, useEffect, useState } from 'react';
import { useDeleteAanpassing, useGetAanpassingen, useSession } from '../context/AuthProvider';

const toDateInputString = (date) => {
    // (toISOString returns something like 2020-12-05T14:15:74Z,
    // date HTML5 input elements expect 2020-12-05
    //
    if (!date) return null;
    if (typeof date !== Object) {
      date = new Date(date);
    }
    if (date.toISOString()[11] === '2') date.setDate(date.getDate()+1)
    const asString = date.toISOString();
    return asString.substring(0, asString.indexOf("T"));
}

export default function AanpassingenBV() {
    const history = useHistory();
    const getAanpassingen = useGetAanpassingen()
    const deleteAanpassing = useDeleteAanpassing()
    const {ready,loading} = useSession()
    const back = useCallback(async ()=>{
        history.push('/')
    },[history]);
    const [aanpassingen,setAanpassingen] = useState()
    const [customError,setCustomError] = useState()
    const [selected,setSelected] = useState()

    const refresh = useCallback(async ()=>{
        const e = await getAanpassingen()
            if (e===404) setCustomError('Er liep iets fout met ophalen van aanpassingen')
            else {
                setAanpassingen(e)
            }
    },[getAanpassingen])

    const del = useCallback(async (id)=>{
        const e = await deleteAanpassing(id)
        if (!e) setCustomError('Kon aanpassing niet verwijderen')
        else refresh()
    },[deleteAanpassing,refresh])

    useEffect(()=>{
        if (ready) {
            refresh()
        }
    },[ready,refresh])

    const Details = memo((props)=>{
        return (<div className="lidedit">
            {props.ob.aanpassinglijst.map(attribute => {
                return <div className="lidattribuut" key={attribute}>
                <div className="acclabel">{attribute+': '} </div>
                <div className="accvalue">{attribute === "geboortedatum" ? toDateInputString(props.ob[attribute]) : props.ob[attribute]}</div>
                </div>
            })}
            <button className="fullwidth wwwijzig" disabled={loading} onClick={()=>del(props.ob.id)}>{'Delete wijziging'}</button>
        </div>)
     })

    const First = memo(()=>{
        if (aanpassingen[0])
        return (
            <>
                {aanpassingen.map(e=>{
                    return (<div key={e.id}><div className={`lidlijst ${selected?.id === e.id ? 'lidselected' : ''}`} onClick={()=>{selected?.id === e.id ? setSelected(null) : setSelected(e)}}>
                    <div className="lidnr">{e.bvid ? e.bvid : 'Geen ID'}</div>
                    <div className="lidnaam">{`(${e.achternaam} ${e.voornaam})`}</div>
                    </div>
                    {selected?.id === e.id ? (<Details ob={e} first={true}/>) : null}
                    </div>)
                })}
            </>
        ); else return <p>Geen aanpassingen gevonden.</p>
    })

    return (<>
                    <button className='backbutton' onClick={back}>{'<'} Terug</button>
                    {customError ? (<p className="error">{customError}</p>): null}
                    <div className="fullwidth margin20"></div>
                    {aanpassingen ? <First /> : null}
                    <div className='fullwidth margin20'></div>
        </>
    )
}