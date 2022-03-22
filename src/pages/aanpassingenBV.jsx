import logo from '../img/logoBC.jpg'
import { useHistory } from "react-router-dom";
import { memo, useCallback, useEffect, useState } from 'react';
import { useDeleteAanpassing, useGetAanpassingen, useGetNewLeden, useInschrijven, useSession } from '../context/AuthProvider';
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

export default function AanpassingenBV() {
    const history = useHistory();
    const getAanpassingen = useGetAanpassingen()
    const inschrijvenn = useInschrijven()
    const getNewLeden = useGetNewLeden()
    const deleteAanpassing = useDeleteAanpassing()
    const {ready,loading} = useSession()
    const back = useCallback(async ()=>{
        history.push('/')
    },[history]);
    const [aanpassingen,setAanpassingen] = useState()
    const [newLeden,setNewLeden] = useState()
    const [customError,setCustomError] = useState()
    const [selected,setSelected] = useState()
    const [edit,setEdit] = useState(false)

    const refresh = useCallback(async ()=>{
        const e = await getAanpassingen()
            if (e===404) setCustomError('Er liep iets fout met ophalen van aanpassingen')
            else {
                setAanpassingen(e)
                const a = await getNewLeden()
                if (a===404) setCustomError('Er liep iets fout met ophalen van nieuwe leden')
                else setNewLeden(a)
            }
    },[getAanpassingen,getNewLeden])

    const del = useCallback(async (id)=>{
        const e = await deleteAanpassing(id)
        if (!e) setCustomError('Kon aanpassing niet verwijderen')
        else refresh()
    },[deleteAanpassing,refresh])

    const inschrijven = useCallback(async ({bvid})=>{
        const e = await inschrijvenn(selected?.id,bvid)
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
            <button className="fullwidth wwwijzig" disabled={loading} onClick={()=>{props.first ? del(props.ob.id) : setEdit(true)}}>{props.first ? 'Delete wijziging' : 'Lid inschrijven'}</button>
        </div>)
     })

    const First = memo(()=>{
        return (
            <>
                {aanpassingen.map(e=>{
                    return (<div key={e.id}><div className={`lidlijst ${selected?.id === e.id ? 'lidselected' : ''}`} onClick={()=>{selected?.id === e.id ? setSelected(null) : setSelected(e)}}>
                    <div className="lidnr">{e.bvid ? e.bvid : 'Geen ID'}</div>
                    <div className="lidnaam">{`${e.voornaam} ${e.achternaam}`}</div>
                    </div>
                    {selected?.id === e.id ? (<Details ob={e} first={true}/>) : null}
                    </div>)
                })}
            </>
        )
    })
    const Second = memo(()=>{
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
    const Edit = memo(()=>{
        const { register, handleSubmit, formState: {errors} } = useForm();
        return (<>
               <form className='grid flex-w accgrid' onSubmit={handleSubmit(inschrijven)}>
                   <div className='lidnaam fullwidth margin20'>{`${selected.voornaam} ${selected.achternaam}`}</div>
                    <label className='acclabel'>Lidnummer: </label>
                   <input className='accvalue' type='number' placeholder='lidnummer' {...register('bvid',{required: 'Dit is vereist'})} />
                   {errors.bvid && <><div className='acclabel'></div><p className='accvalue error'>{errors.bvid.message}</p></>}
                    <button type='submit' className='wwwijzig' disabled={loading}>Wijzigen</button>
                   </form></>)
    })

    return (
        <div className="limit">
            <div className="cntr">
                <div className="wrapper">
                    <img src={logo} alt="logo"/>
                    {edit ? (<>
                        <button className='backbutton' onClick={()=>setEdit(false)}>{'<'} Terug</button>
                        {customError ? (<p className="error">{customError}</p>): null}
                        <Edit/>
                    </>) : (<>
                    <button className='backbutton' onClick={back}>{'<'} Terug</button>
                    {customError ? (<p className="error">{customError}</p>): null}
                    <p className=''>Aanpassingen: </p>
                    {aanpassingen ? <First /> : null}
                    <div className='fullwidth margin20'></div>
                    <p className=''>Nieuwe leden: </p>
                    {newLeden ? <Second /> : null}
                    <div className='fullwidth margin20'></div></>)}
                </div>
            </div>
        </div>
    )
}