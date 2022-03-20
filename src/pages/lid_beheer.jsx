import logo from '../img/logoBC.jpg'
import LidBeheer from '../components/beheerLid'
import { useCallback } from 'react'
import { useHistory } from "react-router-dom";

export default function LedenBeheer() {
    const history = useHistory()
    const back = useCallback(async ()=>{
        history.push('/')
    },[history])
    return (
        <div className="limit">
            <div className="cntr">
                <div className="wrapper">
                    <img src={logo} alt="logo"/>
                    <button className='backbutton' onClick={back}>{'<'} Terug</button>
                    <LidBeheer />
                </div>
            </div>
        </div>
    )
}