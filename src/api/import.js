import {axios} from ".";

export const uploadImport = async (object)=>{
    try {
        const {data} = await axios.post('import',{
            data: object
        })
        return data
    } catch (error){
        return false
    }
}
export const getConfig = async ()=>{
    try {const {data} = await axios.get('import')
    return data }
    catch (error) {
        return 404
    }
}
export const updateConfig = async (object)=>{
    try {
        const {data} = await axios.put('import',{
            data: object
        })
        return data
    } catch (error) {
        return false
    }
}
export const updateList = async (list)=>{
    try {
        const {data} = await axios.put('import/list',{
            list: list
        })
        return data
    } catch (error) {
        return false
    }
}