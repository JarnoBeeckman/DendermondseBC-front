import {axios} from ".";

export const getPrijzen = async ()=>{
    try {const {data} = await axios.get('prijs')
    return data}
    catch (error) {
        return 404
    }
}
export const updateInschrijvingen = async (comp,recreant,jeugd)=>{
    try {
        const {data} = await axios.put('prijs/inschrijving',{
            comp,recreant,jeugd
        })
        return data
    } catch (error) {
        return false
    }
}