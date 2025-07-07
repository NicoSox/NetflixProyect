import axios from "axios";
const API = "http://localhost:3007/peliculas";

export const getPeliculas = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const getOnePelicula = async (id) => {
  const res = await axios.get(`${API}/${id}`);
  return res.data;
};

export const createPelicula = async (pelicula) => {
  return await axios.post(API, pelicula);
};

export const updatePelicula = async (id, pelicula) => {
  return await axios.put(`${API}/${id}`, pelicula);
};

export const deletePelicula = async (id) => {
  return await axios.delete(`${API}/${id}`);
};