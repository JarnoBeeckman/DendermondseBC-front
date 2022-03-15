import { useCallback } from 'react';
import {useSession} from '../context/AuthProvider'
import { useHistory } from "react-router-dom";

export default function AccountGegevens() {
    const {lid,error} = useSession();
    const history = useHistory()
    const back = useCallback(async ()=>{
        history.push('/')
    },[history]);

    const pw = useCallback(async ()=>{
        history.push('/wijzigWachtwoord')
    },[history])


    if (error) return (<div>{error}</div>)
    if (lid) return (
        <>
        <button className='backbutton' onClick={back}>{'<'} Terug</button>
        <div className='grid flex-w accgrid'>
            <label className='acclabel acclabelfirst'>Wachtwoord: </label>
            <div className="accvalue accvaluefirst"><button className='accwijzig' onClick={pw}>Wijzigen</button></div>
            <label className='acclabel'>Voornaam: </label>
            <div className='accvalue'>{lid.voornaam}</div>
            <label className='acclabel'>Achternaam: </label>
            <div className='accvalue'>{lid.achternaam}</div>
            <label className='acclabel'>Adres: </label>
            <div className='accvalue'>{lid.adres}</div>
            <label className='acclabel'>Postcode: </label>
            <div className='accvalue'>{lid.postcode}</div>
            <label className='acclabel'>Woonplaats: </label>
            <div className='accvalue'>{lid.woonplaats}</div>
            <label className='acclabel'>Geslacht: </label>
            <div className='accvalue'>{lid.geslacht}</div>
            <label className='acclabel'>Gsm-nummber: </label>
            <div className='accvalue'>{lid.gsm}</div>
            <label className='acclabel'>Spelertype: </label>
            <div className='accvalue'>{lid.spelertype}</div>
        </div>
    </>
    );
    return <div>Loading...</div>
}
