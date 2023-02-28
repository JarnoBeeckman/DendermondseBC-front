import {axios} from ".";

export const getTrainings = async ()=>{
    try {const {data} = await axios.get('training')
    return data}
    catch (error) {
        return 404
    }
}

export const saveTraining = async (training)=>{
    try {const {data} = await axios.post('training', training)
    return data}
    catch (error) {
        return false
    }
}

export const updateTraining = async (id,training)=>{
    try {const {data} = await axios.put('training/'+id, training)
    return data}
    catch (error) {
        return false
    }
}