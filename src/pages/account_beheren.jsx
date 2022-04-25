import { useCallback, useState } from 'react';
import {useSession, useUpdateLid} from '../context/AuthProvider'
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form"

export default function AccountBeheren() {

    const [edit,setEdit] = useState(false);
    const [customError,setCustomError] = useState(null)
    const { register, handleSubmit, formState: {errors} } = useForm();
    const updateLid = useUpdateLid()
    const {lid,error,loading} = useSession();
    const history = useHistory()
    const back = useCallback(async ()=>{
        history.push('/')
    },[history]);

    const pw = useCallback(async ()=>{
        history.push('/wijzigWachtwoord')
    },[history])

    const handleSub = useCallback(async ({mail,voornaam,achternaam,adres,postcode,woonplaats,geslacht,gsm})=>{
         const e = await updateLid(lid?.id,mail,voornaam,achternaam,adres,postcode,woonplaats,geslacht,gsm)
         if (e) setEdit(false)
         else setCustomError('Er liep iets fout, controleer uw gegevens en contacteer een beheerder als deze juist zijn.')
    },[updateLid,lid?.id])
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
        console.log(asString)
        return asString.substring(0, asString.indexOf("T"));
    }
    if (error) return (<div>{error}</div>)
    if (lid) {
        let groep = ''
        lid.groepnaam.forEach((x,index)=>{
            if (!x) groep = 'null'
            else if (index === 0) groep+=x
            else groep+= `, ${x}`
        })
        if (!edit)
            return (
                <>
                <button className='backbutton margin20' onClick={back}>{'<'} Terug</button>
                {customError ? (<p className="error">{customError}</p>): null}
                <div className='grid flex-w accgrid'>
                    <label className='acclabel acclabelfirst'>Wachtwoord: </label>
                    <div className="accvalue accvaluefirst"><button className='accwijzig' onClick={pw}>Wijzigen</button></div>
                    <label className='acclabel'>Lidnummer: </label>
                    <div className='acclabel accvalue'>{lid.bvid ? lid.bvid : ''}</div>
                    <label className='acclabel'>E-mail adres: </label>
                    <div className='accvalue'>{lid.mail}</div>
                    <label className='acclabel'>{lid.groepnaam.length > 1 ? 'Groepen: ' : 'Groep: '} </label>
                    <div className='accvalue'>{groep}</div>
                    <label className='acclabel'>Voornaam: </label>
                    <div className='accvalue'>{lid.voornaam}</div>
                    <label className='acclabel'>Achternaam: </label>
                    <div className='accvalue'>{lid.achternaam}</div>
                    <label className='acclabel'>Adres: </label>
                    <div className='accvalue'>{lid.adres}</div>
                    <label className='acclabel'>Postcode: </label>
                    <div className='accvalue'>{lid.postcode}</div>
                    <label className='acclabel'>Woonplaats: </label>
                    <div className='accvalue'>{lid.woonplaats}</div>
                    <label className='acclabel'>Geslacht: </label>
                    <div className='accvalue'>{lid.geslacht}</div>
                    <label className='acclabel'>Geboortedatum: </label>
                    <div className='accvalue'>{toDateInputString(lid.geboortedatum)}</div>
                    <label className='acclabel'>Gsm-nummer: </label>
                    <div className='accvalue'>{lid.gsm}</div>
                    <label className='acclabel'>Spelertype: </label>
                    <div className='accvalue'>{lid.status}</div>
                    <label className='acclabel'>Enkel: </label>
                    <div className='accvalue'>{lid.enkel}</div>
                    <label className='acclabel'>Dubbel: </label>
                    <div className='accvalue'>{lid.dubbel}</div>
                    <label className='acclabel'>Mix: </label>
                    <div className='accvalue'>{lid.mix}</div>
                    <button className='wwwijzig' onClick={()=>setEdit(true)}>Wijzigen</button>
                </div>
                
                </>
                );
        if (edit)
            return (
                <>
                    <button className='backbutton margin20' onClick={()=>setEdit(false)}>{'<'} Terug</button>
                    {customError ? (<p className="error">{customError}</p>): null}
                    <form className='grid flex-w accgrid' onSubmit={handleSubmit(handleSub)}>
                        <label className='acclabel'>E-mail adres:</label>
                        <input type='email' className='accvalue' placeholder='e-mail' defaultValue={lid.mail} {...register('mail',{required: 'Dit is vereist'})}></input>
                        {errors.mail && <><div className='acclabel'></div><p className='accvalue error'>{errors.mail.message}</p></>}
                        <label className='acclabel'>Voornaam: </label>
                        <input className='accvalue' type='text' placeholder='voornaam' defaultValue={lid.voornaam} {...register('voornaam',{required: 'Dit is vereist'})} />
                        {errors.voornaam && <><div className='acclabel'></div><p className='accvalue error'>{errors.voornaam.message}</p></>}
                        <label className='acclabel'>Achternaam: </label>
                        <input className='accvalue' type='text' placeholder='achternaam' defaultValue={lid.achternaam} {...register('achternaam',{required: 'Dit is vereist'})} />
                        {errors.achternaam && <><div className='acclabel'></div><p className='accvalue error'>{errors.achternaam.message}</p></>}
                        <label className='acclabel'>Adres: </label>
                        <input className='accvalue' type='text' placeholder='adres' defaultValue={lid.adres}{...register('adres',{required: 'Dit is vereist'})} />
                        {errors.adres && <><div className='acclabel'></div><p className='accvalue error'>{errors.adres.message}</p></>}
                        <label className='acclabel'>Postcode: </label>
                        <input className='accvalue' type='number' placeholder='postcode' defaultValue={lid.postcode}{...register('postcode',{required: 'Dit is vereist',valueAsNumber:true})} />
                        {errors.postcode && <><div className='acclabel'></div><p className='accvalue error'>{errors.postcode.message}</p></>}
                        <label className='acclabel'>Woonplaats: </label>
                        <input className='accvalue' type='text' placeholder='woonplaats' defaultValue={lid.woonplaats}{...register('woonplaats',{required: 'Dit is vereist'})} />
                        {errors.woonplaats && <><div className='acclabel'></div><p className='accvalue error'>{errors.woonplaats.message}</p></>}
                        <label className='acclabel select'>Geslacht: </label>
                        <select className='accvalue' defaultValue={lid.geslacht}{...register('geslacht',{required: 'Dit is vereist'})}>
                            <option value='M'>Man</option>
                            <option value='V'>Vrouw</option>
                        </select>
                        {errors.geslacht && <><div className='acclabel'></div><p className='accvalue error'>{errors.geslacht.message}</p></>}
                        <label className='acclabel'>Gsm-nummer: </label>
                        <input className='accvalue' type='tel' placeholder='gsm-nummer' defaultValue={lid.gsm}{...register('gsm',{required: 'Dit is vereist'})} />
                        {errors.gsm && <><div className='acclabel'></div><p className='accvalue error'>{errors.gsm.message}</p></>}
                        <button className='wwwijzig' type='submit' disabled={loading}>Bevestigen</button>
                    </form>
                </>
            );
         }
    return <div>Loading...</div>
}
