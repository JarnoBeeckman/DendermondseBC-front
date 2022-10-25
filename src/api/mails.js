import { axios } from ".";

export const sendMail = async (list, cc, onderwerp, isVanilla, text, bijlagen) => {
  try {
    const { data } = await axios.post("mails", {
      ontvangers: list,
      cc: cc,
      onderwerp: onderwerp,
      isVanilla: isVanilla,
      text: text,
      bijlagen: bijlagen,
    });

    return data;
  } catch (error) {}
};
export const getAll = async () => {
  try {
    const { data } = await axios.get("mails/template");
    return data;
  } catch (error) {
    return 404;
  }
};
export const createTemplate = async (naam, onderwerp, body, vars, bijlagen) => {
  try {
    const { data } = await axios.post("mails/template", {
      naam,
      onderwerp,
      body,
      vars,
      bijlagen,
    });
    return data;
  } catch (error) {
    return false;
  }
};
export const updateTemplate = async (
  id,
  naam,
  onderwerp,
  body,
  vars,
  bijlagen
) => {
  try {
    const { data } = await axios.put("mails/template/" + id, {
      naam,
      onderwerp,
      body,
      vars,
      bijlagen,
    });
    return data;
  } catch (error) {
    return false;
  }
};
export const deleteTemplate = async (id) => {
  try {
    const { data } = await axios.delete("mails/template/" + id);
    return data;
  } catch (error) {
    return false;
  }
};
