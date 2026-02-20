import axios from "axios"
import {ACCESS_TOKEN} from "./constants"

const items = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

items.interceptors.request.use(
    (config) => {
        console.log("in interceptors request use")
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        console.log("axios rejected")
        return Promise.reject(error)
    }
)

export default items