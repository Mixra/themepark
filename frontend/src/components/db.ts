import axios from "axios";

const baseURL: string = "http://localhost:5194/api";

const db = axios.create({
  baseURL,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});

export default db;
