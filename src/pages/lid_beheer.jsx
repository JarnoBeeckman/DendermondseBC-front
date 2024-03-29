import { useCallback, useEffect, useState,memo } from "react";
import { useAdminUpdateLid, useGetAllLeden, useSession, useDeleteLid } from "../context/AuthProvider"
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form"

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

export default function LedenBeheer() {
    const list =  useGetAllLeden();
    const {ready} = useSession()
    const [lidLijst,setLidLijst] = useState()
    const [selected,setSelected] = useState()
    const [customError,setCustomError] = useState(null)
    const [status,setStatus] = useState('0')
    const [edit,setEdit] = useState()
    const [amount,setAmount] = useState()
    const adminUpdateLid = useAdminUpdateLid()
    const {loading} = useSession()
    const del = useDeleteLid()
    
    const refresh = useCallback(async ()=>{
        const a = await list()
        setLidLijst(a)
    },[list])

    const history = useHistory()
    const back = useCallback(async (edit)=>{
        edit ? setEdit(false) : history.push('/')
    },[history])

    const handleSub = useCallback(async ({username,mail,voornaam,achternaam,adres,postcode,woonplaats,geslacht,geboortedatum,gsm,status,bvid})=>{
        const e = await adminUpdateLid(selected?.id,username,mail,voornaam,achternaam,adres,postcode,woonplaats,geslacht,geboortedatum,gsm,status,bvid)
        if (e) {
            setEdit(false)
            await refresh()
            setSelected(e)
            setCustomError('')
        }
        else setCustomError('Er liep iets fout, controleer uw gegevens en contacteer een beheerder als deze juist zijn.')
   },[adminUpdateLid,selected?.id,refresh])

   const deleteLid = useCallback(async ()=>{
       const e = await del(selected?.id)
       if (e) {
           setEdit(false)
           await refresh()
       } else setCustomError('Kon lid niet verwijderen, heeft deze nog een groep of betalingen?')
   },[del,selected?.id,refresh])

    useEffect(()=>{
        if (ready) {
            refresh();
        }
    },[ready,refresh])
    
    const Edit = memo(()=>{
        const { register, handleSubmit, formState: {errors} } = useForm();
        return (<><button className='backbutton margin20' onClick={()=>back(true)}>{'<'} Terug</button>
        {customError ? (<p className="error">{customError}</p>): null}
               <form className='grid flex-w accgrid margin20' onSubmit={handleSubmit(handleSub)}>
                   <label className="acclabel">Lidnummer: </label>
                   <input className="accvalue" type='number' placeholder="lidnummer" defaultValue={selected.bvid} {...register('bvid', {required: 'Dit is vereist'})} />
                   {errors.bvid && <><div className='acclabel'></div><p className='accvalue error'>{errors.bvid.message}</p></>}
                   <label className='acclabel'>Username: </label>
                   <input className='accvalue' type='text' placeholder='username' defaultValue={selected.username} {...register('username',{required: 'Dit is vereist'})} />
                   {errors.username && <><div className='acclabel'></div><p className='accvalue error'>{errors.username.message}</p></>}
                   <label className='acclabel'>E-mail adres:</label>
                   <input type='email' className='accvalue' placeholder='e-mail' defaultValue={selected.mail} {...register('mail',{required: 'Dit is vereist'})}></input>
                   {errors.mail && <><div className='acclabel'></div><p className='accvalue error'>{errors.mail.message}</p></>}
                   <label className='acclabel'>Voornaam: </label>
                   <input className='accvalue' type='text' placeholder='voornaam' defaultValue={selected.voornaam} {...register('voornaam',{required: 'Dit is vereist'})} />
                   {errors.voornaam && <><div className='acclabel'></div><p className='accvalue error'>{errors.voornaam.message}</p></>}
                   <label className='acclabel'>Achternaam: </label>
                   <input className='accvalue' type='text' placeholder='achternaam' defaultValue={selected.achternaam} {...register('achternaam',{required: 'Dit is vereist'})} />
                   {errors.achternaam && <><div className='acclabel'></div><p className='accvalue error'>{errors.achternaam.message}</p></>}
                   <label className='acclabel'>Adres: </label>
                   <input className='accvalue' type='text' placeholder='adres' defaultValue={selected.adres}{...register('adres',{required: 'Dit is vereist'})} />
                   {errors.adres && <><div className='acclabel'></div><p className='accvalue error'>{errors.adres.message}</p></>}
                   <label className='acclabel'>Postcode: </label>
                   <input className='accvalue' type='number' placeholder='postcode' defaultValue={selected.postcode}{...register('postcode',{required: 'Dit is vereist',valueAsNumber:true})} />
                   {errors.postcode && <><div className='acclabel'></div><p className='accvalue error'>{errors.postcode.message}</p></>}
                   <label className='acclabel'>Woonplaats: </label>
                   <input className='accvalue' type='text' placeholder='woonplaats' defaultValue={selected.woonplaats}{...register('woonplaats',{required: 'Dit is vereist'})} />
                   {errors.woonplaats && <><div className='acclabel'></div><p className='accvalue error'>{errors.woonplaats.message}</p></>}
                   <label className='acclabel select'>Geslacht: </label>
                   <select className='accvalue' defaultValue={selected.geslacht}{...register('geslacht',{required: 'Dit is vereist'})}>
                       <option value='M'>Man</option>
                       <option value='V'>Vrouw</option>
                   </select>
                   {errors.geslacht && <><div className='acclabel'></div><p className='accvalue error'>{errors.geslacht.message}</p></>}
                   <label className='acclabel'>Geboortedatum: </label>
                   <input className='accvalue' type='date' defaultValue={toDateInputString(selected.geboortedatum)}{...register('geboortedatum',{required: 'Dit is vereist'})} />
                   {errors.geboortedatum && <><div className='acclabel'></div><p className='accvalue error'>{errors.geboortedatum.message}</p></>}
                   <label className='acclabel'>Gsm-nummer: </label>
                   <input className='accvalue' type='tel' placeholder='gsm-nummer' defaultValue={selected.gsm}{...register('gsm',{required: 'Dit is vereist'})} />
                   {errors.gsm && <><div className='acclabel'></div><p className='accvalue error'>{errors.gsm.message}</p></>}
                   <label className='acclabel'>Status: </label>
                   <select className='accvalue' defaultValue={selected.status} {...register('status',{required: 'Dit is vereist'})} >
                        <option value='Recreant'>Recreant</option>
                        <option value='Jeugd'>Jeugd</option>
                        <option value='Competitiespeler'>Competitiespeler</option>
                        <option value='Inactief'>Inactief</option>
                    </select>
                   {errors.status && <><div className='acclabel'></div><p className='accvalue error'>{errors.status.message}</p></>}
                   <button className='wwwijzig' type='submit' disabled={loading}>Bevestigen</button>
               </form>
               <button className="wwwijzig delete" onClick={()=>deleteLid()}>Verwijderen</button>
               </>) 
    })
    const Details = memo((props)=>{
        let groep = ''
        if (Array.isArray(props.ob.groepnaam))
        props.ob.groepnaam?.forEach((x,index)=>{
            if (index === 0) groep+=x
            else groep+= `, ${x}`
        }); else groep = props.ob.groepnaam
       return (<div className="lidedit">
           <div className="lidattribuut">
            <div className="acclabel">Username: </div>
            <div className="accvalue">{props.ob.username}</div>
           </div>
           <div className="lidattribuut">
               <div className="acclabel">{props.ob.groepnaam?.length > 1 && Array.isArray(props.ob.groepnaam) ? 'Groepen: ' : 'Groep: '}</div>
               <div className="accvalue">{groep}</div>
           </div>
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
           <div className="lidattribuut">
            <div className="acclabel">Enkel: </div>
            <div className="accvalue">{props.ob.enkel}</div>
           </div>
           <div className="lidattribuut">
            <div className="acclabel">Dubbel: </div>
            <div className="accvalue">{props.ob.dubbel}</div>
           </div>
           <div className="lidattribuut">
            <div className="acclabel">Mix: </div>
            <div className="accvalue">{props.ob.mix}</div>
           </div>
           <div className="lidattribuut"></div>
           <button className="fullwidth wwwijzig" onClick={()=>setEdit(true)}>Wijzigen</button>
       </div>)
    })

    const Lid = memo((props)=>{
        let list = []
        if (Array.isArray(props.ob.kleur))
            props.ob.kleur.forEach(x=>list.push(x))
        else list.push(props.ob.kleur)
        return (<><div className={`lidlijst ${selected?.id === props.ob.id ? 'lidselected' : ''}`} onClick={()=>{selected?.id === props.ob.id ? setSelected(null) : setSelected(props.ob); setCustomError('')}}>
            <div className="lidnr">{props.ob.bvid ? props.ob.bvid : 'Geen ID'}</div>
            <div className="lidnaam">{`${props.ob.achternaam} ${props.ob.voornaam}`}</div>
            <div className="circles lidstatus">
                {list ? list.map(x=>{
                    return (<div className="circle" key={x} style={{backgroundColor: x,marginRight: '5px'}}/>)
                }) : ''}
            </div>
            </div>
            {selected?.id === props.ob.id ? (<Details ob={props.ob}/>) : null}
            </>)
    })

    const filterStatus = useCallback(lid=>{
        if (status === '0') return true
        if (status === 'Volwassene') return lid.status === 'Recreant' || lid.status === 'Competitiespeler'
        return lid.status === status
    },[status])

    const Filtered = memo((props)=>{
        let temp = lidLijst.filter(x=> filterStatus(x))
        setAmount(temp.length)
        return (<>{temp.map(x=>{return <Lid key={x.id} ob={x}/>})}</>)
    })

    if (ready && lidLijst) {
        if (!edit)
        return (<>
         <button className='backbutton margin20' onClick={()=>back(false)}>{'<'} Terug</button>
         <div className="fullwidth center flex">
                    <select onChange={e=>setStatus(e.target.value)} defaultValue={status}>
                            <option value={'0'}>Alles</option>
                            <option value={'Jeugd'}>Jeugd</option>
                            <option value={'Competitiespeler'}>Competitiespeler</option>
                            <option value={'Recreant'}>Recreant</option>
                            <option value={'Volwassene'}>Volwassene</option>
                        </select>
                </div>
            <div className="margin20"/>
            <p>Aantal: {amount}</p>
            <Filtered/>
        </>)
        else return (<>
             <Edit />
        </>);
    }
    return (<div>Loading...</div>)

}