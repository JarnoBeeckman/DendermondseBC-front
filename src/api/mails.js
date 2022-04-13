import {axios} from ".";

export const sendMail = async (list,cc,bcc,onderwerp,text,bijlagen)=>{
    const {data} = await axios.post('mails/',{
        ontvangers: list,
        cc: cc,
        bcc:bcc,
        onderwerp:onderwerp,
        text:text,
        bijlagen:bijlagen
    })

    return data
}