
import { useHistory } from "react-router-dom";
import { useCallback, useState } from 'react';
import { useForm } from "react-hook-form"
import { useChangePassword, useSession } from '../context/AuthProvider';

export default function WijzigWachtwoord() {
    const history = useHistory();
    const changePassword = useChangePassword();
    const {loading,lid} = useSession();
    const { register, handleSubmit, formState: {errors} } = useForm();
    const [customError,setCustomError] = useState(null)

    const back = useCallback(async ()=>{
        history.push('/accountBeheren')
    },[history]);

    const handleSub = useCallback(async ({current,wachtwoord,wachtwoordd})=>{
        if (wachtwoord === wachtwoordd) {
            const e = await changePassword(lid?.id,lid?.vanilla === 1 ? lid?.username: current,wachtwoord)
            if (e === 200) {
                if (lid?.vanilla === 1) {
                    setCustomError('Gelieve de pagina te herladen om de wijzigingen door te voeren.')
                    }
                else back()
            }
            else if (e === 403) setCustomError('Huidig wachtwoord is incorrect')
            else setCustomError('Er is iets misgegaan, check server status of conctacteer een beheerder')
        } else setCustomError('Nieuw wachtwoord komt niet overeen')
    },[changePassword,lid?.id,back,lid?.username,lid?.vanilla])

    return (
    <>
                <button className={`backbutton margin20 `} onClick={back}>{'<'} Terug</button>
                {customError ? (<p className="error">{customError}</p>): null}
                {lid?.vanilla === 1 ? <><p>Gelieve je wachtwoord te wijzigen. Deze is niet veilig.</p></> : ''}
                <form className='grid flex-w accgrid' onSubmit={handleSubmit(handleSub)}>
                    {lid?.vanilla === 1 ? '' : <>
                    <label className={`acclabel ${lid?.vanilla === 1 ? 'hidden' : ''}`}>Huidig wachtwoord: </label>
                    <input className={`accvalue`} defaultValue={lid?.vanilla === 1 ? lid.username : ''} type='password' placeholder='huidig' {...register('current',{required: 'Dit is vereist'})} />                        
                    {errors.current && <><div className='acclabel'></div><p className='accvalue error'>{errors.current.message}</p></>}
                    </>}
                    <label className='acclabel'>Nieuw wachtwoord: </label>
                   <input className='accvalue' type='password' placeholder='nieuw' {...register('wachtwoord',{required: 'Dit is vereist',minLength:{value:7,message:'Dit moet minstens 7 tekens bevatten'}})}/>
                    {errors.wachtwoord && <><div className='acclabel'></div><p className='accvalue error'>{errors.wachtwoord.message}</p></>}                       
                    <label className='acclabel'>Herhaal nieuw wachtwoord: </label>
                   <input className='accvalue' type='password' placeholder='herhaal'{...register('wachtwoordd',{required: 'Dit is vereist',minLength:{value:7,message:'Dit moet minstens 7 tekens bevatten'}})}/>
                    {errors.wachtwoordd && <><div className='acclabel'></div><p className='accvalue error'>{errors.wachtwoordd.message}</p></>}
                   <button className='wwwijzig' type='submit' disabled={loading}>Bevestigen</button>
               </form>
    </>
    )
}