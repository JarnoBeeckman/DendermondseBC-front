import {axios} from ".";

export const getTrainings = async ()=>{
    try {const {data} = await axios.get('training')
    return data}
    catch (error) {
        return 404
    }
}

export const getTrainers = async ()=>{
    try {const {data} = await axios.get('training/trainers')
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

export const deleteTraining = async (id)=>{
    try {
    await axios.delete('training/'+id)
    return true
    } catch (error) {
        return false
    }
}

export const getAanwezigheden = async (id)=>{
    try {
        const {data} = await axios.get('training/aanwezigheden/'+id)
        return data
    } catch (error) {
        return 404
    }
}

export const updateAanwezigheden = async (id, aanwezigheden)=>{
    try {
        const {data} = await axios.put('training/aanwezigheden/'+id, aanwezigheden)
        return data
    } catch (error) {
        return false
    }
}