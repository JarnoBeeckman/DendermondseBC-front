import { axios } from ".";

export const login = async (username, wachtwoord) => {
  const { data } = await axios.post(`account/login`, {
    username,
    wachtwoord,
  });
  return data;
};

export const register = async (
  mail,
  wachtwoord,
  voornaam,
  achternaam,
  adres,
  postcode,
  woonplaats,
  geslacht,
  geboortedatum,
  gsm,
  status
) => {
  try {
    const { data } = await axios.post(`account`, {
      mail,
      wachtwoord,
      voornaam,
      achternaam,
      adres,
      postcode,
      woonplaats,
      geslacht,
      geboortedatum,
      gsm,
      status,
    });
    return data;
  } catch (error) {}
};

export const getLidById = async (id) => {
  const { data } = await axios.get(`account/${id}`);
  return data;
};
export const ChangePassword = async (id, current, wachtwoord) => {
  const { data } = await axios.put(`account/wachtwoord/${id}`, {
    current,
    wachtwoord,
  });
  return data;
};
export const updateLid = async (
  id,
  mail,
  voornaam,
  achternaam,
  adres,
  postcode,
  woonplaats,
  geslacht,
  gsm
) => {
  const { data } = await axios.put(`account/${id}`, {
    mail,
    voornaam,
    achternaam,
    adres,
    postcode,
    woonplaats,
    geslacht,
    gsm,
  });
  return data;
};
export const adminUpdateLid = async (
  id,
  username,
  mail,
  voornaam,
  achternaam,
  adres,
  postcode,
  woonplaats,
  geslacht,
  geboortedatum,
  gsm,
  status,
  bvid
) => {
  const { data } = await axios.put(`account/admin/${id}`, {
    username,
    mail,
    voornaam,
    achternaam,
    adres,
    postcode,
    woonplaats,
    geslacht,
    geboortedatum,
    gsm,
    status,
    bvid,
  });
  return data;
};
export const getAllLeden = async () => {
  const { data } = await axios.get("account");
  return data;
};
export const getAanpassingen = async () => {
  const { data } = await axios.get("account/aanpassingen");
  return data;
};
export const getNewLeden = async () => {
  const { data } = await axios.get("account/nieuwe");
  return data;
};
export const deleteAanpassing = async (id) => {
  const { data } = await axios.delete(`account/aanpassingen/${id}`);
  return data;
};
export const inschrijven = async (id, bvid, enkel, dubbel, mix,stuurMail) => {
  const { data } = await axios.put(`account/aanpassingen/${id}`, {
    bvid,
    enkel,
    dubbel,
    mix,
    stuurMail
  });
  return data;
};
export const deleteLid = async (id) => {
  const { data } = await axios.delete(`account/${id}`);
  return data;
};
export const forgot = async (username) => {
  try {
    const { data } = await axios.put(`account/forgot/${username}`);
    return data;
  } catch (error) {
    return false;
  }
};
export const reset = async (key,wachtwoord) => {
  try {
    const { data } = await axios.put(`account/reset/${key}`,{wachtwoord});
    return data;
  } catch (error) {
    return false;
  }
};
