import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form"
import { useLogin, useSession } from "../context/AuthProvider";
import { useHistory } from "react-router-dom";
import './login.css'


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

    return (
            <div className="limit">
                <div className="conlogin">
                    <div className="wraplogin">
                        {error ? (<p className="text-red-500 errorlogin">{JSON.stringify(error)}</p>): null}
                        <form className="loginform validate-form flex-sb flex-w" onSubmit={handleSubmit(handleLogin)}>
                            <span className="loginformtitle">Login</span>
                            <div className="wrapinput validate-input">
                                <input id="mail" className="input" type="text" defaultValue="" data-cy='mail' placeholder="mail" {...register('mail',{required: 'Dit is vereist'})}/>
                                <span className="focusinput"></span>
                            </div>
                            {errors.mail && <p>{errors.mail.message}</p>}
                            <div className="wrapinput validate-input">
                                <input id="pw" className="input" type="password" data-cy='wachtwoord'placeholder="wachtwoord" {...register('wachtwoord',{required: 'Dit is vereist'})}/>
                                <span className="focusinput"></span>
                            </div>
                            {errors.wachtwoord && <p>{errors.wachtwoord.message}</p>}
                            <div className="conloginform">
                                <button type="submit" className="loginbutton" disabled={loading} data-cy='login' >Log in</button>
                                {console.log(loading)}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    )

}