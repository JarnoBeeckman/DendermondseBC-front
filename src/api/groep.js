import {axios} from ".";


export const getAll = async ()=>{
    try {
    const {data} = await axios.get('groep')
    return data
    } catch (error) {
        return 404
    }
}
export const updateById = async (id,groepnaam,kleur,aantal)=>{
    try {
        const {data} = await axios.put(`groep/${id}`,{
            groepnaam: groepnaam,
            kleur:kleur,
            aantal:aantal
        }); return data
    } catch (error) {
        return false
    }
}
export const create = async (groepnaam,kleur,aantal)=>{
    try {
        const {data} = await axios.post('groep',{
            groepnaam:groepnaam,
            kleur:kleur,
            aantal:aantal
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