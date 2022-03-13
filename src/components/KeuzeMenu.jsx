import { memo } from "react";
import { useSession } from "../context/AuthProvider";
import config from '../config.json'

export default function KeuzeMenu() {
   const {lid,loading,error} = useSession();

   const Buttn = memo((props)=>{
    return <button className="keuzemenubutton" key={props.page}>{props.page}</button>
   })

    if (lid) {
        if (!lid.roles.includes('beheerder')) {
        return (
        <div className="buttongrid">
            {lid.roles.map(role=>{
               const x = config.pages[role]
               return x.map(page=>{

                return <Buttn key={page} page={page}/>
                    })
            })}
        </div>
        ) }
        return (<div className="buttongrid flex-w flex-sb">
        {config.pages.beheerder.map(page=>{
            return <Buttn key={page} page={page}/>
        })}
        </div>);
    }
    if (loading) 
        return <div>Loading...</div>
    if (error)
        return <div>{error}</div>
    return <></>
}