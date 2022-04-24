import { useCallback, useState } from "react";
import { useForm } from "react-hook-form"
import * as LidApi from '../../api/lid.js';



export default function Register() {

    const { register, handleSubmit, formState: {errors} } = useForm();
    const [customError,setCustomError] = useState()
    const [loading,setLoading] = useState()
    const [registered,setRegistered] = useState(false)

    const handleSub = useCallback(async ({mail,wachtwoord,wachtwoordd,voornaam,achternaam,adres,postcode,woonplaats,geslacht,geboortedatum,gsm,status})=>{
        setLoading(true)
        if (wachtwoord === wachtwoordd){
        const e = await LidApi.register(mail,wachtwoord,voornaam,achternaam,adres,postcode,woonplaats,geslacht,geboortedatum,gsm,status)
        if (!e) setCustomError('Kon niet registreren')
        else setRegistered(true)
        } else setCustomError('Wachtwoord komt niet overeen')
        setLoading(false)
    },[])

    if (registered)
    return <>
    <div className="fullwidth margin20"/>
    <p>U bent geregistreerd.</p>
    </>
    return <>
        {customError ? (<p className="error">{customError}</p>): null}
        <form className='grid flex-w accgrid' onSubmit={handleSubmit(handleSub)}>
                        <label className='acclabel'>E-mail adres:</label>
                        <input type='email' className='accvalue' placeholder='e-mail' {...register('mail',{required: 'Dit is vereist'})}></input>
                        {errors.mail && <><div className='acclabel'></div><p className='accvalue error'>{errors.mail.message}</p></>}
                        <label className="acclabel">Wachtwoord: </label>
                        <input type='password' className="accvalue" {...register('wachtwoord',{required: 'Dit is vereist',minLength:{value:7,message:'Dit moet minstens 7 tekens bevatten'}})} />
                        {errors.wachtwoord && <><div className='acclabel'></div><p className='accvalue error'>{errors.wachtwoord.message}</p></>}                       
                        <label className="acclabel">Herhaal wachtwoord: </label>
                        <input type='password' className="accvalue" {...register('wachtwoordd',{required: 'Dit is vereist',minLength:{value:7,message:'Dit moet minstens 7 tekens bevatten'}})}/>
                        {errors.wachtwoordd && <><div className='acclabel'></div><p className='accvalue error'>{errors.wachtwoordd.message}</p></>}
                        <label className='acclabel'>Voornaam: </label>
                        <input className='accvalue' type='text' placeholder='voornaam'  {...register('voornaam',{required: 'Dit is vereist'})} />
                        {errors.voornaam && <><div className='acclabel'></div><p className='accvalue error'>{errors.voornaam.message}</p></>}
                        <label className='acclabel'>Achternaam: </label>
                        <input className='accvalue' type='text' placeholder='achternaam'  {...register('achternaam',{required: 'Dit is vereist'})} />
                        {errors.achternaam && <><div className='acclabel'></div><p className='accvalue error'>{errors.achternaam.message}</p></>}
                        <label className='acclabel'>Adres: </label>
                        <input className='accvalue' type='text' placeholder='adres'{...register('adres',{required: 'Dit is vereist'})} />
                        {errors.adres && <><div className='acclabel'></div><p className='accvalue error'>{errors.adres.message}</p></>}
                        <label className='acclabel'>Postcode: </label>
                        <input className='accvalue' type='number' placeholder='postcode' {...register('postcode',{required: 'Dit is vereist',valueAsNumber:true})} />
                        {errors.postcode && <><div className='acclabel'></div><p className='accvalue error'>{errors.postcode.message}</p></>}
                        <label className='acclabel'>Woonplaats: </label>
                        <input className='accvalue' type='text' placeholder='woonplaats'{...register('woonplaats',{required: 'Dit is vereist'})} />
                        {errors.woonplaats && <><div className='acclabel'></div><p className='accvalue error'>{errors.woonplaats.message}</p></>}
                        <label className='acclabel select'>Geslacht: </label>
                        <select className='accvalue'{...register('geslacht',{required: 'Dit is vereist'})}>
                            <option value='M'>Man</option>
                            <option value='V'>Vrouw</option>
                            <option value='A'>Andere</option>
                        </select>
                        {errors.geslacht && <><div className='acclabel'></div><p className='accvalue error'>{errors.geslacht.message}</p></>}
                        <label className="acclabel">Geboortedatum: </label>
                        <input className="accvalue" type='date' {...register('geboortedatum',{required: 'Dit is vereist'})} />
                        {errors.geboortedatum && <><div className='acclabel'></div><p className='accvalue error'>{errors.geboortedatum.message}</p></>}
                        <label className='acclabel'>Gsm-nummer: </label>
                        <input className='accvalue' type='tel' placeholder='gsm-nummer' {...register('gsm',{required: 'Dit is vereist'})} />
                        {errors.gsm && <><div className='acclabel'></div><p className='accvalue error'>{errors.gsm.message}</p></>}
                        <label className="acclabel">Spelertype: </label>
                        <select className="accvalue" {...register('status')}>
                            <option value='Recreant'>Recreant</option>
                            <option value='Jeugd'>Jeugd</option>
                            <option value='Competitiespeler'>Competitiespeler</option>
                        </select>
                        <button className='wwwijzig' type='submit' disabled={loading}>Bevestigen</button>
                    </form>
    </>
    
}