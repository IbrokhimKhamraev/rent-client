import axios from "axios";

axios.defaults.baseURL = 'http://rent-server-production.up.railway.app/api'
axios.defaults.url = "http://rent-server-production.up.railway.app/"
axios.defaults.headers.post["Content-Type"] = "application/json"
axios.defaults.withCredentials = true

export const url = axios.defaults.url