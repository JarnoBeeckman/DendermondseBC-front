
import { createContext, useCallback, useContext, useMemo,useEffect,useState } from "react";
import * as api from "../api";
import * as LidApi from '../api/lid.js';
import config from '../config.json';

const AuthContext = createContext();
const JWT_TOKEN_KEY = config.token_key;

function parseJWT(token) {
    if (!token) return {};
    const base64url = token.split('.')[1];
    const payload = Buffer.from(base64url, 'base64');
    const jsonPayLoad = payload.toString('ascii');
    return JSON.parse(jsonPayLoad);
}
function parseExp(exp) {
    if (!exp) return null;
    if (typeof exp !== 'number') exp=Number(exp);
    if (isNaN(exp)) return null;
    return new Date(exp*1000);
}

const useAuth = ()=> useContext(AuthContext);

export const useSession = ()=>{
    const {loading,error,token,lid,ready, hasRole, component} = useAuth();
    return {loading,error,token,lid,ready,isAuthed: Boolean(token), hasRole, component}
}

export const useLogin = ()=>{
    const {login} = useAuth();
    return login;
}

export const useLogout = ()=>{
    const {logout} = useAuth();
    return logout;
}
export const useRegister = () =>{
    const { register } = useAuth();
    return register;
}
export const AuthProvider = ({children})=>{
    const [ready,setReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [token,setToken] = useState(localStorage.getItem(JWT_TOKEN_KEY));
    const [lid,setLid] = useState(null);

    const setSession = useCallback(async (token,lid)=>{
        const {exp,userId} = parseJWT(token);
        const expiry = parseExp(exp);
        const stillValid = expiry >= new Date();

        if (stillValid) {
            localStorage.setItem(JWT_TOKEN_KEY,token);
        } else {
            localStorage.removeItem(JWT_TOKEN_KEY);
            token = null;
            if (expiry) {
                setError('Session expired, sign in again');
            }
        }
        api.setAuthToken(token);
        setReady(token && stillValid);
        setToken(token);

        if (!lid && stillValid) {
            lid = await LidApi.getLidById(userId);
        }
        setLid(lid);
    },[])

    useEffect(()=>{
       setSession(token);
    },[token,setSession])

    const login = useCallback(async({mail,wachtwoord})=>{
        try {
            setLoading(true)
            setError('');
            const {token,user} = await LidApi.login(mail,wachtwoord);
            await setSession(token,user);
            return true;
        } catch(error) {
            console.error(error)
            setError('Login failed')
            return false;
        } finally {
            setLoading(false);
        }
    },[setSession]);

    const register = useCallback(async (data)=>{
        try {
            setLoading(true);
            setError('');
            const {token, lid} = await LidApi.register(data)
            await setSession(token,lid);
            return true;
        } catch (error) {
            setError(error);
            return false;
        } finally {
            setLoading(false);
        }
    },[setSession])
    const logout = useCallback(()=>{
        setSession(null);
        setLid(null);
    },[setSession]);

    const hasRole = useCallback((role)=>{
        if (!lid) return false;
        return lid.roles.include(lid)
    },[lid])
    
    const value= useMemo(()=>({
        loading,error,token,lid,login,logout,register,ready,hasRole
    }),[loading,error,token,lid,login,logout,register,ready,hasRole]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

    
}