import {axios} from ".";

export const getAll = async ()=>{
    try {
    const {data} = await axios.get('betaling')
    return data
    } catch (error) {
        return 404
    }
}
export const updateById = async (id,naam,actief)=>{
    try {
        const {data} = await axios.put(`betaling/${id}`,{
            naam: naam,
            actief:actief
        }); return data
    } catch (error) {
        return false
    }
}
export const create = async (naam,actief)=>{
    try {
        const {data} = await axios.post('betaling',{
            naam:naam,
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
} /*
export const linkGroep = async (gid,id)=>{
    try {
        const {data} = await axios.post(`groep/lid/${id}`,{
            groepId:gid
        })
        return data
    } catch(error) {
        return false
    }
}
export const unlinkGroep = async (gid,id)=>{
    try {
        await axios.put(`groep/lid/${id}`,{
            groepId:gid
        })
        return true
    } catch(error) {
        return false
    }
}*/