import { useEffect, useState } from "react";
import { useSession } from "../context/AuthProvider"

export default function Main() {
    const [elid, setElid] = useState();
    const {lid: authLid} = useSession();
    const {ready : authReady} = useSession();

    useEffect(()=>{
        if (authReady) {
            setElid(authLid)
        }
    },[authReady,authLid])
    return (<>
    <h1>Main page</h1>
    <p>{elid}</p>
    </>)
}