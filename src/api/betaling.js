import {axios} from ".";

export const getAll = async ()=>{
    try {
    const {data} = await axios.get('betaling')
    return data
    } catch (error) {
        return 404
    }
}
export const updateById = async (id,naam,inschrijving,actief)=>{
    try {
        const {data} = await axios.put(`betaling/${id}`,{
            naam: naam,
            inschrijving:inschrijving,
            actief:actief
        }); return data
    } catch (error) {
        return false
    }
}
export const create = async (naam,inschrijving,actief)=>{
    try {
        const {data} = await axios.post('betaling',{
            naam:naam,
            inschrijving:inschrijving,
            actief:actief
        })
        return data
    } catch(error) {
        return false
    }
}
export const deleteById = async (id)=>{
    try {
        await axios.delete(`betaling/${id}`)
        return true
    } catch(error) {
        return false
    }
} 
export const getAllBetalingen = async ()=>{
    try {
        const {data} = await axios.get('betaling/account/')
        return data
        } catch (error) {
            return 404
        }
}
export const link = async (bid,lid,prijs,datum)=>{
    try {
        const {data} = await axios.post(`betaling/account/`,{
            soortId:bid,
            ledenId:lid,
            prijs:prijs,
            datum:datum
        })
        return data
    } catch(error) {
        return false
    }
}
export const unlink = async (id)=>{
    try {
        await axios.delete(`betaling/account/${id}`)
        return true
    } catch(error) {
        return false
    }
}