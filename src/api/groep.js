import {axios} from ".";


export const getAll = async ()=>{
    try {
    const {data} = await axios.get('groep')
    return data
    } catch (error) {
        return 404
    }
}
export const getLeden = async ()=>{
    try {
        const {data}=await axios.get('groep/leden')
        return data
    } catch (error) {
        return 404
    }
}
export const updateById = async (id,groepnaam,kleur)=>{
    try {
        const {data} = await axios.put(`groep/${id}`,{
            groepnaam: groepnaam,
            kleur:kleur
        }); return data
    } catch (error) {
        return false
    }
}
export const create = async (groepnaam,kleur)=>{
    try {
        const {data} = await axios.post('groep',{
            groepnaam:groepnaam,
            kleur:kleur
        })
        return data
    } catch(error) {
        return false
    }
}
export const deleteById = async (id)=>{
    try {
        await axios.delete(`groep/${id}`)
        return true
    } catch(error) {
        return false
    }
}
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
}