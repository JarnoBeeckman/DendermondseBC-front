import logo from '../img/logoBC.jpg'
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
            const e = await changePassword(lid?.id,current,wachtwoord)
            if (e === 200) back()
            else if (e === 403) setCustomError('Huidig wachtwoord is incorrect')
            else setCustomError('Er is iets misgegaan, check server status of conctacteer een beheerder')
        } else setCustomError('Nieuw wachtwoord komt niet overeen')
    },[changePassword,lid?.id,back])

    return (
    <>
        <div className="limit">
            <div className="cntr">
                <div className="wrapper">
                    <img src={logo} alt="logo"/>
                    <button className='backbutton' onClick={back}>{'<'} Terug</button>
                    {customError ? (<p className="">{customError}</p>): null}
                    <form className='grid flex-w accgrid' onSubmit={handleSubmit(handleSub)}>
                        <label className='acclabel'>Huidig wachtwoord: </label>
                        <input className='accvalue' type='password' placeholder='huidig' {...register('current',{required: 'Dit is vereist'})} />
                        {errors.current && <><div className='acclabel'></div><p className='accvalue error'>{errors.current.message}</p></>}
                        <label className='acclabel'>Nieuw wachtwoord: </label>
                        <input className='accvalue' type='password' placeholder='nieuw' {...register('wachtwoord',{required: 'Dit is vereist'})}/>
                        {errors.wachtwoord && <><div className='acclabel'></div><p className='accvalue error'>{errors.wachtwoord.message}</p></>}
                        <label className='acclabel'>Herhaal nieuw wachtwoord: </label>
                        <input className='accvalue' type='password' placeholder='herhaal'{...register('wachtwoordd',{required: 'Dit is vereist'})}/>
                        {errors.wachtwoordd && <><div className='acclabel'></div><p className='accvalue error'>{errors.wachtwoordd.message}</p></>}
                        <button className='wwwijzig' type='submit' disabled={loading}>Bevestigen</button>
                    </form>
                </div>
            </div>
        </div>
    </>
    )
}