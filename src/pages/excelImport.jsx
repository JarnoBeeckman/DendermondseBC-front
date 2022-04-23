import { useHistory } from "react-router-dom";
import { useState, useCallback } from "react";
import * as xlsx from 'xlsx'
import * as api from '../api/import'

/*const toDateInputString = (date) => {
    // (toISOString returns something like 2020-12-05T14:15:74Z,
    // date HTML5 input elements expect 2020-12-05
    //
    if (!date) return null;
    if (typeof date !== Object) {
      date = new Date(date);
    }
    const asString = date.toISOString();
    return asString.substring(0, asString.indexOf("T"));
}
function addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }*/

export default function ExcelImport() {

    const history = useHistory()
    const [customError,setCustomError]=useState();
    const [file,setFile] = useState()
    const [loading,setLoading] = useState(false)
    const [response,setResponse] = useState()

    const back = useCallback(async ()=>{
        history.push('/')
    },[history])

    const convert = useCallback(()=> new Promise((resolve,reject)=>{
        const reader = new FileReader()
        reader.readAsBinaryString(file)
        reader.onload = (event)=>{
            let binary = event.target.result
            let book = xlsx.read(binary, {type:'binary', cellDates:true})
            const data = xlsx.utils.sheet_to_json(book.Sheets[book.SheetNames[0]])
            //console.log(toDateInputString(addDays(data[0].dob,1)))
            resolve(data)
        }
        reader.onerror = error => reject(error)
        
    }),[file])

    

    const bevestig = useCallback(async ()=>{
        if (file) {
            setCustomError('')
            setLoading(true)
            const data = await convert()
            const e = await api.uploadImport(data)
            if (!e) setCustomError('Er ging iets mis tijdens het updaten.')
            else {
                setResponse(e)
            }
            setLoading(false)
        }
            
        else setCustomError('Geen bestand geselecteerd')
    },[file,convert])

    const saveFile = useCallback(async (event)=>{
        setCustomError('')
        setFile(event.target.files[0])
    },[])

    if (!response)
    return <>
        <button className='backbutton margin20' onClick={back}>{'<'} Terug</button>
        {customError ? (<p className="error">{customError}</p>): null}
        <div className="grid flex-w justify fullwidth">
            <label className="acclabel">Excel bestand: </label>
            <input type='file' className="accvalue" accept=".xls,.xlsx" onChange={saveFile}/>
            <button className="wwwijzig" disabled={loading} onClick={bevestig}>Bevestigen</button>
        </div>
    </>
    return <>
        <button className='backbutton margin20' onClick={back}>{'<'} Terug</button>
        {Array.isArray(response) && response.length === 0 ? <p>De gegevens zijn bijgewerkt.</p> : <div className="grid flex-w justify fullwidth">
                <div className="fullwidth textcenter">Deze leden konden niet worden bijgewerkt. Controleer hun lidnummer.</div>
                <div className="margin20 fullwidth"></div>
                {response.map(x=>{return <div key={x} className="fullwidth grid flex-w justify"><label className="acclabel">{x.split(':')[0]}</label><div className="accvalue">{x.split(':')[1]}</div></div>})}
            </div>}
    </>
}