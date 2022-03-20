import {axios} from ".";


export const login = async (username,wachtwoord)=>{
    const {data} = await axios.post(`account/login`,{
        username,wachtwoord
    });
    return data
}

export const register = async (mail,wachtwoord,voornaam,achternaam,adres,postcode,woonplaats,geslacht,geboortedatum,gsm,spelertype)=>{
  const {data} = await axios.post(`account`,{
     mail,wachtwoord,voornaam,achternaam,adres,postcode,woonplaats,geslacht,geboortedatum,gsm,spelertype
 })
 return data
}

export const getLidById = async (id)=>{
    const {data} = await axios.get(`account/${id}`)
    return data
}
export const ChangePassword = async (id,current,wachtwoord)=>{
    const {data} = await axios.put(`account/wachtwoord/${id}`,{
        current,wachtwoord
    })
    return data
}
export const updateLid = async (id,voornaam,achternaam,adres,postcode,woonplaats,geslacht,gsm)=>{
    const {data} = await axios.put(`account/${id}`,{
        voornaam,achternaam,adres,postcode,woonplaats,geslacht,gsm
    })
    return data
}
export const getAllLeden = async ()=>{
    const {data} = await axios.get('account');
    return data
}