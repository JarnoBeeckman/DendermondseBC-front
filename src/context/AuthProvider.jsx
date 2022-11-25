
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
    const {loading,error,token,lid,ready, hasRole} = useAuth();
    return {loading,error,token,lid,ready,isAuthed: Boolean(token),hasRole}
}

export const useLogin = ()=>{
    const {login} = useAuth();
    return login;
}
export const useDeleteLid = ()=>{
    const {deleteLid} = useAuth()
    return deleteLid
}
export const useSetSession = ()=>{
    const {setSession} = useAuth();
    return setSession;
}

export const useChangePassword = ()=>{
    const {changePassword} = useAuth()
    return changePassword
}
export const useAdminUpdateLid = ()=>{
    const {adminUpdateLid} = useAuth()
    return adminUpdateLid
}
export const useLogout = ()=>{
    const {logout} = useAuth();
    return logout;
}
export const useRegister = () =>{
    const { register } = useAuth();
    return register;
}
export const useUpdateLid = ()=>{
    const {updateLid} = useAuth()
    return updateLid
}
export const useGetAllLeden = ()=>{
    const {getAllLeden} = useAuth()
    return getAllLeden
}
export const useGetAanpassingen = ()=>{
    const {getAanpassingen} = useAuth()
    return getAanpassingen
}
export const useGetNewLeden = ()=>{
    const {getNewLeden} = useAuth()
    return getNewLeden
}
export const useDeleteAanpassing = ()=>{
    const {deleteAanpassing} = useAuth()
    return deleteAanpassing
}
export const useInschrijven = ()=>{
    const {inschrijven} = useAuth()
    return inschrijven
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

    const login = useCallback(async({username,wachtwoord})=>{
        try {
            setLoading(true)
            setError('');
            const {token,user} = await LidApi.login(username,wachtwoord);
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
        return lid.roles.include(role)
    },[lid])

    const changePassword = useCallback(async (id,current,wachtwoord)=>{
        try {
            setLoading(true);
            setError('');
            await LidApi.ChangePassword(id,current,wachtwoord);
            return 200;
        } catch (error) {
            if (error.response?.status === 403)
            return 403
            return false;
        } finally {
            setLoading(false)
        }
    },[])

    const deleteLid = useCallback(async (id)=>{
        try {
            setError('')
            setLoading(true)
            await LidApi.deleteLid(id)
            return true
        } catch (error) {
            return false
        } finally {
            setLoading(true)
        }
    },[])

    const updateLid = useCallback(async (id,mail,voornaam,achternaam,adres,postcode,woonplaats,geslacht,gsm)=>{
        try {
            setError('')
            setLoading(true);
            const e = await LidApi.updateLid(id,mail,voornaam,achternaam,adres,postcode,woonplaats,geslacht,gsm)
            setLid(e)
            return e
        } catch (error) {
            return false;
        } finally {
            setLoading(false)
        }
    },[])
    const adminUpdateLid = useCallback(async (id,username,mail,voornaam,achternaam,adres,postcode,woonplaats,geslacht,geboortedatum,gsm,status,bvid)=>{
        try {
            setError('')
            setLoading(true)
            const e = await LidApi.adminUpdateLid(id,username,mail,voornaam,achternaam,adres,postcode,woonplaats,geslacht,geboortedatum,gsm,status,bvid)
            return e
        } catch (error) {
            return false
        } finally {
            setLoading(false)
        }
    },[])

    const getAllLeden = useCallback(async ()=>{
        try {
            setLoading(true)
            setError('')
            const e = await LidApi.getAllLeden()
            return e
        } catch (error) {
            return false
        } finally {
            setLoading(false)
        }
    },[])
    const getAanpassingen = useCallback(async ()=>{
        try {
            setError('')
            setLoading(true)
            return await LidApi.getAanpassingen()
        } catch (error) {
            return 404
        } finally {
            setLoading(false)
        }
    },[])
    const deleteAanpassing = useCallback(async (id)=>{
        try {
            setError('')
            setLoading(true)
             await LidApi.deleteAanpassing(id)
             return true
        } catch(error) {
            return false
        } finally {
            setLoading(false)
        }
    },[])
    const getNewLeden = useCallback(async ()=>{
        try {
            setError('')
            setLoading(true)
            return await LidApi.getNewLeden()
        } catch (error) {
            return 404
        } finally {
            setLoading(false)
        }
    },[])
    const inschrijven = useCallback(async (id,bvid,enkel,dubbel,mix,stuurMail)=>{
        try {   
            setError('')
            setLoading(true)
            await LidApi.inschrijven(id,bvid,enkel,dubbel,mix,stuurMail)
            return true
        } catch (error) {
            return false
        } finally {
            setLoading(false)
        }
    },[])
    
    const value= useMemo(()=>({
        loading,error,token,lid,login,logout,register,ready,hasRole,changePassword,updateLid,getAllLeden,adminUpdateLid,getAanpassingen,getNewLeden,deleteAanpassing,inschrijven,deleteLid,setSession
    }),[loading,error,token,lid,login,logout,register,ready,hasRole,changePassword,updateLid,getAllLeden,adminUpdateLid,getAanpassingen,getNewLeden,deleteAanpassing,inschrijven,deleteLid,setSession]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

    
}