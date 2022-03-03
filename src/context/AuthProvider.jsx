
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
    const {loading,error,token,lid,ready} = useAuth();
    return {loading,error,token,lid,ready,isAuthed: Boolean(token)}
}

export const useLogin = ()=>{
    const {login} = useAuth();
    return login;
}

export const useLogout = ()=>{
    const {logout} = useAuth();
    return logout;
}
export const AuthProvider = ({children})=>{
    const [ready,setReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [token,setToken] = useState(localStorage.getItem(JWT_TOKEN_KEY));
    const [lid,setLid] = useState(null);

    const setSession = useCallback((token)=>{
        const {exp} = parseJWT(token);
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
        setReady(stillValid);
        setToken(token);
    },[])

    useEffect(()=>{
       setSession(token);
    },[token,setSession])

    const login = useCallback(async({mail,wachtwoord})=>{
        try {
            setLoading(true)
            setError('');
            const {token,lid} = await LidApi.login(mail,wachtwoord);
            setSession(token);
            setLid(lid)
            return true;
        } catch(error) {
            console.error(error)
            setError('Login failed')
            return false;
        } finally {
            setLoading(false);
        }
    },[setSession]);

    const logout = useCallback(()=>{
        setSession(null);
        setLid(null);
    },[setSession]);
    
    const value= useMemo(()=>({
        loading,error,token,lid,login,logout,ready
    }),[loading,error,token,lid,login,logout,ready]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

    
}