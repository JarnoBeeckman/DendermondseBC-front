import { useEffect, useState } from "react";
import { useSession } from "../context/AuthProvider"
import logo from '../img/logoBC.jpg'

export default function Main() {
    const [elid, setElid] = useState();
    const {lid: authLid} = useSession();
    const {ready : authReady} = useSession();

    useEffect(()=>{
        if (authReady) {
            setElid(authLid)
        }
    },[authReady,authLid])
    return (
    <div className="limit">
        <div className="cntr"><img src={logo} alt="logo"></img></div>
    </div>
    )
}