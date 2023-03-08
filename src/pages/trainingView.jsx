import { useCallback, useEffect, useState,memo } from "react";
import { useSession } from "../context/AuthProvider"
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form"
import { getTrainings, saveTraining, updateTraining,deleteTraining,getTrainers,submitTraining } from "../api/training";
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header'; 
import List from '@editorjs/list'; 
import SimpleImage from '@editorjs/simple-image'

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

export default function TrainingView() {
    const {ready,lid} = useSession()
    const [customError,setCustomError] = useState(null)
    const [loading,setLoading] = useState()
    const [edit,setEdit] = useState()
    const [list,setList] = useState()
    const [groepen,setGroepen] = useState()
    const [editor,setEditor] = useState(undefined)
    const [selected,setSelected] = useState()
    const [trainers,setTrainers] = useState()

    const history = useHistory()
    const back = useCallback(async ()=>{
        setEditor(undefined)
        if (selected) {
            setSelected(false)
            setEdit(false)
        } else 
        history.push('/')
    },[history,selected])

    const refresh = useCallback(async ()=>{
        setCustomError(null)
        setLoading(true)
        const e = await getTrainings()
        if (e === 404) setCustomError('Kon trainingen niet laden')
        else {
            setList(e?.training)
            setGroepen(e?.groep)
            if (lid?.roles.includes('trainer') || lid?.roles.includes('beheerder')) {
            const a = await getTrainers()
            if (a === 404) setCustomError('Kon trainers niet laden')
            else setTrainers(a)
            }
        } 
        setLoading(false)
    },[lid])

    useEffect( ()=>{
        if (ready) {
            refresh()
        }
    },[ready,refresh])

    const goToAanwezigheid = useCallback(()=>{
        history.push('/aanwezigheden/?key='+selected?.trid)
    },[history,selected])

    const save = useCallback(async (training)=>{
        setLoading(true)
        training.trbody = await editor.save().then(x=>{return x}).catch(x=>setCustomError('Kon gegevens niet verwerken.'))
        const a = selected === -1? await saveTraining(training):await updateTraining(selected.trid,training)
        if (a) {
            setEditor(undefined)
            await back()
            await refresh()
        }
        else setCustomError('Kon training niet opslaan')
        setLoading(false)
    },[editor,refresh,selected,back])

    const submit = useCallback(async ()=>{
        setLoading(true)
        const e = await submitTraining(selected.trid, {upgrade:selected.trstatus === 1})
        if (e) {
            await back()
            await refresh()
        }
        else setCustomError('Kon training niet indienen')
        setLoading(false)
    },[selected,refresh,back])

    const delTraining = useCallback(async ()=>{
        setLoading(true)
        const a = await deleteTraining(selected.trid)
        if (a) {
            await back()
            await refresh()
        }
        else setCustomError('Kon training niet verwijderen')
        setLoading(false)
    },[selected,back,refresh])

    const Training = memo(({tr})=>{
        let list = []
        if (Array.isArray(tr.kleur))
            tr.kleur.forEach(a=>list.push(a))
        else list.push(tr.kleur)
        return <div className={`lidlijst center`} onClick={()=>setSelected(tr)}>
            <div className="">{toDateInputString(tr.trdatum)}</div>
            <div className="lidnaam">{tr.tronderwerp}</div>
                    <div className="circles lidstatus">
                {list ? list.map(x=>{
                    return (<div className="circle" key={x} style={{backgroundColor: x,marginRight: '5px'}}/>)
                }) : ''}
            </div>
        </div>
    })

    const Edit = memo(()=>{
        const { register, handleSubmit, formState: {errors} } = useForm();
        return <><form onSubmit={handleSubmit(save)} className='grid flex-w justify fullwidth'>
                    <label className="acclabel">Groep: </label>
                    <select className="accvalue inputfix" defaultValue={selected===-1?'':selected?.trgroep} {...register('trgroep',{required: 'Dit is vereist'})}>
                    {groepen && groepen.map(x=>( <option key={x.gid} value={x.gid}>{x.groepnaam}</option>))}
                    </select>
                    <label className="acclabel">Trainer: </label>
                    <select className="accvalue inputfix" defaultValue={selected===-1?lid.id:selected?.trcreator} {...register('trcreator',{required: 'Dit is vereist'})}>
                    {trainers && trainers.map(x=>( <option key={x.id} value={x.id}>{x.voornaam+' '+x.achternaam}</option>))}
                    </select>
                    {errors.trgroep && <><div className='acclabel'></div><p className='accvalue error'>{errors.trgroep.message}</p></>}
                    <label className="acclabel">Datum: </label>
                    <input className='accvalue' type='date' defaultValue={selected === -1 ? toDateInputString(Date.now()) :toDateInputString(selected?.trdatum)}{...register('trdatum')} />
                    {errors.trdatum && <><div className='acclabel'></div><p className='accvalue error'>{errors.trdatum.message}</p></>}
                    <label className="acclabel">Onderwerp: </label>
                    <input className="accvalue inputfix" defaultValue={selected===-1?'':selected?.tronderwerp} {...register('tronderwerp',{required: 'Dit is vereist'})}></input>
                    {errors.tronderwerp && <><div className='acclabel'></div><p className='accvalue error'>{errors.tronderwerp.message}</p></>}
                    <div className="margin20 fullwidth" />
                    <div id="editorjs" className="editor"/>
                    <button disabled={loading} className="wwwijzig" type="submit">Opslaan</button>
                </form>
                {selected!==-1&&<button className="wwwijzig delete" onClick={()=>delTraining()}>Verwijderen</button>}
            </>
    })

    const Status = memo(()=>{
        const strings = ["Geen aanwezigheden","Aanwezigheden ingegeven","Afgewerkt","Betaald"]
        return <div className="accvalue">{strings[selected?.trstatus]}</div>
    })

    const Details = memo(()=>{
        
        return <div className="grid flex-w justify fullwidth">
            <label className="acclabel">Groep: </label>
            <div className="accvalue" style={{color:selected?.kleur,textShadow:"-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black"}}>{selected?.groepnaam}</div>
            <label className="acclabel">Trainer: </label>
            <div className="accvalue">{selected?.voornaam+' '+selected?.achternaam}</div>
            <label className="acclabel">Datum: </label>
            <div className="accvalue">{toDateInputString(selected?.trdatum)}</div>
            <label className="acclabel">Status: </label>
            <Status />
            <label className="acclabel">Onderwerp: </label>
            <div className="accvalue">{selected?.tronderwerp}</div>
            <div className="margin20 fullwidth" />
            <div id="editorjs" className="editor"/>
            {selected.trcreator === lid.id && <button className="wwwijzig" onClick={()=>{setEditor(undefined); setEdit(true)}}>Wijzig</button>}
            {selected.trcreator === lid.id && <button className="wwwijzig" onClick={()=>{goToAanwezigheid()}}>Aanwezigheden {selected.trstatus === 0 ? 'ingeven':'bewerken'}</button>}
            {selected.trcreator === lid.id && (selected.trstatus === 1 || selected.trstatus === 2) && <button className="wwwijzig" onClick={()=>{submit()}}>{selected.trstatus === 2?'Niet a':'A'}fgewerkt en betalingsaanvraag {selected.trstatus === 2 ? 'annuleren':'indienen'}</button>}
        </div>
    })

    if (selected && !loading) {
        if (!editor)
    setEditor(new EditorJS({
        holder: 'editorjs', 
         tools: { 
            header: Header, 
            list: List,
            image: SimpleImage,
          }, 
          data: selected?.trbody,
          readOnly: !edit
      }))
    }


    return <>
        <button className='backbutton margin20' onClick={back}>{'<'} Terug</button>
        {loading && <div>Loading...</div>}
        {customError && <div className='error'>{customError}</div>}

        {edit&& <Edit />}

        {selected && selected !== -1 && !edit && <Details/>}

        {Array.isArray(list) && !selected ? 
         <>{lid?.roles.includes('trainer') && <button className='wwwijzig' onClick={()=>{setSelected(-1);setEdit(true)}} disabled={loading}>Nieuwe training</button>}
            <div className="margin20 fullwidth" />
          {list.map(tr => {
            return <Training tr={tr} key={tr.trid}/>
          })}
        </>:null}
    </>
}