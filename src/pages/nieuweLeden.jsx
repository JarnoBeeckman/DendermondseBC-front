import { useHistory } from "react-router-dom";
import { memo, useCallback, useEffect, useState } from 'react';
import {useGetNewLeden, useInschrijven, useSession } from '../context/AuthProvider';
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
}

export default function NieuweLeden() {
    const history = useHistory();
    const inschrijvenn = useInschrijven()
    const getNewLeden = useGetNewLeden()
    const {ready,loading} = useSession()
    const back = useCallback(async ()=>{
        history.push('/')
    },[history]);
    const [newLeden,setNewLeden] = useState()
    const [customError,setCustomError] = useState()
    const [selected,setSelected] = useState()
    const [edit,setEdit] = useState(false)

    const refresh = useCallback(async ()=>{
        const a = await getNewLeden()
                if (a===404) setCustomError('Er liep iets fout met ophalen van nieuwe leden')
                else setNewLeden(a)
    },[getNewLeden])

    const inschrijven = useCallback(async ({bvid,enkel,dubbel,mix})=>{
        const e = await inschrijvenn(selected?.id,bvid,enkel,dubbel,mix)
        if (e) {
            await refresh()
            setEdit(false)
        } else setCustomError('Kon wijziging niet maken')
    },[inschrijvenn,refresh,selected?.id])

    useEffect(()=>{
        if (ready) {
            refresh()
        }
    },[ready,refresh])

    const Users = memo(()=>{
        return (
            <>
                {newLeden.map(e=>{
                    return (<div key={e.id}><div className={`lidlijst ${selected?.id === e.id ? 'lidselected' : ''}`} onClick={()=>{selected?.id === e.id ? setSelected(null) : setSelected(e)}}>
                    <div className="lidnr">{e.bvid ? e.bvid : 'Geen ID'}</div>
                    <div className="lidnaam">{`${e.voornaam} ${e.achternaam}`}</div>
                    </div>
                    {selected?.id === e.id ? (<Details ob={e} first={false}/>) : null}
                    </div>)
                })}
            </>
        )
    })

    const Details = memo((props)=>{
        return (<div className="lidedit">
            <div className="lidattribuut">
             <div className="acclabel">E-mail: </div>
             <div className="accvalue">{props.ob.mail}</div>
            </div>
            <div className="lidattribuut">
                <div className="acclabel">Adres: </div>
                <div className="accvalue">{props.ob.adres}</div>
            </div>
            <div className="lidattribuut">
                <div className="acclabel">Postcode: </div>
                <div className="accvalue">{props.ob.postcode}</div>
            </div>
            <div className="lidattribuut">
                <div className="acclabel">Woonplaats: </div>
                <div className="accvalue">{props.ob.woonplaats}</div>
            </div>
            <div className="lidattribuut">
                <div className="acclabel">Geslacht: </div>
                <div className="accvalue">{props.ob.geslacht}</div>
            </div>
            <div className="lidattribuut">
             <div className="acclabel">Geboortedatum: </div>
             <div className="accvalue">{toDateInputString(props.ob.geboortedatum)}</div>
            </div>
            <div className="lidattribuut">
                <div className="acclabel">Gsm-nummer: </div>
                <div className="accvalue">{props.ob.gsm}</div>
            </div>
            <div className="lidattribuut">
             <div className="acclabel">Status: </div>
             <div className="accvalue">{props.ob.status}</div>
            </div>
            <button className="fullwidth wwwijzig" disabled={loading} onClick={()=>setEdit(true)}>{'Lid inschrijven'}</button>
        </div>)
     })

     const Edit = memo(()=>{
        const { register, handleSubmit, formState: {errors} } = useForm();
        return (<>
               <form className='grid flex-w accgrid' onSubmit={handleSubmit(inschrijven)}>
                   <div className='lidnaam fullwidth margin20'>{`${selected.voornaam} ${selected.achternaam}`}</div>
                    <label className='acclabel'>Lidnummer: </label>
                   <input className='accvalue' type='number' placeholder='lidnummer' {...register('bvid',{required: 'Dit is vereist'})} />
                   {errors.bvid && <><div className='acclabel'></div><p className='accvalue error'>{errors.bvid.message}</p></>}
                   <label className='acclabel'>Enkel: </label>
                   <input className='accvalue' type='number' placeholder='enkel niveau' defaultValue={12} {...register('enkel',{required: 'Dit is vereist'})} />
                   {errors.enkel && <><div className='acclabel'></div><p className='accvalue error'>{errors.enkel.message}</p></>}
                   <label className='acclabel'>Dubbel: </label>
                   <input className='accvalue' type='number' placeholder='dubbel niveau' defaultValue={12} {...register('dubbel',{required: 'Dit is vereist'})} />
                   {errors.dubbel && <><div className='acclabel'></div><p className='accvalue error'>{errors.dubbel.message}</p></>}
                   <label className='acclabel'>Mix: </label>
                   <input className='accvalue' type='number' placeholder='mix niveau' defaultValue={12} {...register('mix',{required: 'Dit is vereist'})} />
                   {errors.mix && <><div className='acclabel'></div><p className='accvalue error'>{errors.mix.message}</p></>}
                    <button type='submit' className='wwwijzig' disabled={loading}>Registreren</button>
                   </form></>)
    })

     return (<>
        
        {edit ? (<>
            <button className='backbutton' onClick={()=>setEdit(false)}>{'<'} Terug</button>
            {customError ? (<p className="error">{customError}</p>): null}
            <Edit/>
        </>) : (<>
        <button className='backbutton' onClick={back}>{'<'} Terug</button>
        {customError ? (<p className="error">{customError}</p>): null}
        <div className="fullwidth margin20"></div>
        {newLeden ? <Users /> : null}
        <div className='fullwidth margin20'></div></>)}
</>
)
}