import { memo, useCallback } from "react";
import { useSession } from "../context/AuthProvider";
import config from '../config.json'
import { useLogout } from "../context/AuthProvider";
import { useHistory } from "react-router-dom";

export default function KeuzeMenu() {
   const {lid,loading,error} = useSession();
   const logout = useLogout();
   const history = useHistory();

   const loguit = useCallback(async ()=>{
    await logout()
   },[logout])

   const goTo = useCallback(async (url)=>{
        history.push(`/${url}`)
        return;
   },[history])

   const Buttn = memo((props)=>{
    return <button className="keuzemenubutton" key={props.page} onClick={props.click}>{props.page}</button>
   })

    if (lid) {
        if (!lid.roles.includes('beheerder')) {
        return (
        <div className="grid flex-w">
            {lid.roles.map(role=>{
               const x = config.pages[role]
               return x.map(page=>{

                return <Buttn key={page[0]} page={page[0]} click={()=>goTo(page[1])}/>
                    })
            })}
            <Buttn key={'log uit'} page={'Log uit'} click={loguit}/>
        </div>
        ) }
        return (<div className="grid flex-w">
        {config.pages.beheerder.map(page=>{
            return <Buttn key={page[0]} page={page[0]} click={()=>goTo(page[1])}/>
        })}
        <Buttn key={'Log uit'} page={"Log uit"} click={loguit} />
        </div>);
    }
    if (loading) 
        return <div>Loading...</div>
    if (error)
        return <div>{error}</div>
    return <></>
}