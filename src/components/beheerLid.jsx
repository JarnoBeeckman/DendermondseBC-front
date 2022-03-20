import { useCallback, useEffect, useState,memo } from "react";
import { useGetAllLeden, useSession } from "../context/AuthProvider"

export default function LidBeheer() {
    const list =  useGetAllLeden();
    const {ready} = useSession()
    const [lidLijst,setLidLijst] = useState()
    const [selected,setSelected] = useState()
    const e = useCallback(async ()=>{
        const a = await list()
        setLidLijst(a)
    },[list])

    useEffect(()=>{
        if (ready) {
            e();
        }
    },[ready,e])
    const Edit = memo((props)=>{
       return (<div className="lidedit">
           <div className="lidattribuut">
            <div className="acclabel">Username: </div>
            <div className="accvalue">{props.ob.username}</div>
           </div>
           <div className="lidattribuut">
               <div className="acclabel">Adres: </div>
               <div className="accvalue">{props.ob.adres}</div>
           </div>
           <div className="lidattribuut">
               <div className="acclabel">Postcode: </div>
               <div className="accvalue">{props.ob.postcode}</div>
           </div>
           <div className="lidattribuut">
               <div className="acclabel">Woonplaats: </div>
               <div className="accvalue">{props.ob.woonplaats}</div>
           </div>
           <div className="lidattribuut">
               <div className="acclabel">Geslacht: </div>
               <div className="accvalue">{props.ob.geslacht}</div>
           </div>
           <div className="lidattribuut">
               <div className="acclabel">Gsm-nummer: </div>
               <div className="accvalue">{props.ob.gsm}</div>
           </div>
       </div>)
    })

    const Lid = memo((props)=>{

        return (<><div className={`fullwidth lidlijst ${selected === props.ob ? 'lidselected' : ''}`} onClick={()=>setSelected(props.ob)}>
            <div className="lidnr">{props.ob.bvid ? props.ob.bvid : 'Geen ID'}</div>
            <div className="lidnaam">{`${props.ob.voornaam} ${props.ob.achternaam}`}</div>
            <div className="lidstatus">{props.ob.status}</div>
            </div>
            {selected === props.ob ? (<Edit ob={props.ob}/>) : null}
            </>)
    })

    if (ready && lidLijst) {
        return (<>
            {lidLijst.map(lid=>{
                return <Lid key={lid.id} ob={lid}/>
            })}
        </>)
    }
    return (<div>Loading...</div>)

}