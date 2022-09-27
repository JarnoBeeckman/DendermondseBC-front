import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form"
import { useCallback, useState } from "react";
import * as lid from "../../api/lid"

export default function ForgotPassword() {

    const { register, handleSubmit, formState: {errors} } = useForm();
    const history = useHistory();
    const [done,setDone] = useState(false)
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState()

    const back = useCallback(async ()=>{
        history.push('/')
    },[history])

    const exe = useCallback(async ({username})=>{
        setLoading(true)
        setError('')
        const e = await lid.forgot(username)
        if (e) {
            setDone(true)
        }
        else setError('Kon wachtwoord niet resetten, controleer username of probeer later opnieuw.')
        setLoading(false)
    },[])
    if (done)
    return <>
        <button className='backbutton margin20' onClick={back}>{'<'} Terug</button>
        <p>Er is een link verstuurd. Controleer uw mailbox.</p>
    </>
    return <>
        <button className='backbutton margin20' onClick={back}>{'<'} Terug</button>
        {error ? (<p className="error">{error}</p>): null}
        <form className="grid flex-w justify fullwidth" onSubmit={handleSubmit(exe)}>
            <label className="acclabel">Username: </label>
            <input className="accvalue inputfix" {...register('username',{required: 'Dit is vereist'})}/>
            {errors.username && <><div className='acclabel'></div><p className='accvalue error' >{errors.username.message}</p></>}
            <button className="wwwijzig" disabled={loading} type="submit">Bevestigen</button>
        </form>
    </>
}