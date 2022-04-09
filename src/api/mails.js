import {axios} from ".";

export const sendMail = async ()=>{
    const {data} = axios.get()
    return data
}