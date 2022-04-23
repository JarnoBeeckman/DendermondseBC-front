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