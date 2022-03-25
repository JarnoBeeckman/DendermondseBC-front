import {axios} from ".";


export const getAll = async ()=>{
    try {
    const {data} = await axios.get('groep')
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