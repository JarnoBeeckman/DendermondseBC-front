import {axios} from ".";

export const getPrijzen = async ()=>{
    try {const {data} = await axios.get('facts/prijzen')
    return data}
    catch (error) {
        return 404
    }
}
export const updateInschrijvingen = async (comp,recreant,jeugd)=>{
    try {
        const {data} = await axios.put('facts/inschrijving',{
            comp,recreant,jeugd
        })
        return data
    } catch (error) {
        return false
    }
}