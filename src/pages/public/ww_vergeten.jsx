import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form"
import { useCallback, useState } from "react";
import * as lid from "../../api/lid"

export default function ForgotPassword() {

    const { register, handleSubmit, formState: {errors} } = useForm();
    const history = useHistory();
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState()

    const back = useCallback(async ()=>{
        history.push('/')
    },[history])

    const forward = useCallback(async ()=>{
        history.push('/reset')
    },[history])

    const exe = useCallback(async ({username})=>{
        setLoading(true)
        setError('')
        const e = await lid.forgot(username)
        if (e) {
            await forward()
        }
        else setError('Kon mail niet verzenden, controleer username of probeer later opnieuw.')
        setLoading(false)
    },[forward])
    
    return <>
        <button className='backbutton margin20' onClick={back}>{'<'} Terug</button>
        {error ? (<p className="error">{error}</p>): null}
        <p>Heb je al een code gekregen via mail? Dan kan je deze stap overslaan.</p>
        <button className="wwwijzig" onClick={forward}>Ik heb al een code</button>
        
        <form className="grid flex-w justify fullwidth" onSubmit={handleSubmit(exe)}>
        <div className="margin20 fullwidth"/><div className="margin20 line fullwidth"/>
            <label className="acclabel">Username: </label>
            <input className="accvalue inputfix" {...register('username',{required: 'Dit is vereist'})}/>
            {errors.username && <><div className='acclabel'></div><p className='accvalue error' >{errors.username.message}</p></>}
            <button className="wwwijzig" disabled={loading} type="submit">Verstuur code</button>
        </form>
    </>
}