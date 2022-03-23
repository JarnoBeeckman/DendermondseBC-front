import logo from '../img/logoBC.jpg'
import KeuzeMenu from "../components/KeuzeMenu";
import { useHistory } from 'react-router-dom';
import { useCallback } from 'react';

export default function Instellingen() {
    const history = useHistory()
    const back = useCallback(async ()=>{
        history.push('/')
    },[history])
    return (<div className="limit">
                <div className="cntr">
                    <div className="wrapper">
                        <img src={logo} alt="logo"/>
                        <button className='backbutton' onClick={back}>{'<'} Terug</button>
                        <KeuzeMenu view={'settings'}/>
                    </div>
                </div>
            </div>
            )
}