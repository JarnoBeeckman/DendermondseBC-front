import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form"
import { useLogin, useSession } from "../context/AuthProvider";
import { useHistory } from "react-router-dom";


export default function Login() {
    const login = useLogin();
    const history = useHistory();
    const {loading,error,isAuthed} = useSession();
    const { register, handleSubmit, formState: {errors} } = useForm();

    useEffect(()=>{
        if (isAuthed) {
            history.push('/');
        }
    })

    const handleLogin = useCallback(async({mail,wachtwoord})=>{
        const e = await login({mail,wachtwoord});
        if(e){
            history.push('/');
        }
    },[login,history])

    return (<>
            <div className="mx-auto">
                <h1 className="">Log in</h1>
                {error ? (<p className="text-red-500 errorlogin">{JSON.stringify(error)}</p>): null}
                <form className="grid grid-cols-1 login" onSubmit={handleSubmit(handleLogin)}>
                    <label htmlFor="mail">email:</label>
                    <input id="mail" type="text" defaultValue="" data-cy='mail' placeholder="your@mail.com" {...register('mail',{required: 'This is required'})}/>
                    {errors.mail && <p className="text-red-500">{errors.mail.message}</p>}
                    <label htmlFor="wachtwoord">wachtwoord:</label>
                    <input id="pw" type="password" data-cy='wachtwoord'placeholder="wachtwoord" {...register('wachtwoord',{required: 'This is required'})}/>
                    {errors.wachtwoord && <p className="text-red-500">{errors.wachtwoord.message}</p>}
                    <div className="loginbutton">
                        <button type="submit" className="disabled:opacity-50 lbut " disabled={loading} data-cy='login' >Log in</button>
                    </div>
                </form>
            </div>
            </>
    )

}