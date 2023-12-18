import axios from "axios"
import { apiurl } from "../context/apiurl"
import { toast } from "react-custom-alert"
import { LogError } from "./handleErrors"

const alertError = (message: string) => toast.error(`${message}`)


export async function login(email: string, password:string){
    try {
        const response = await axios.post(`${apiurl}/api/user/signin`, {
          email: email.toLowerCase(),
          password
        })
  
        if (response.status === 401) {
          alertError('Invalid Email')
        } else if (response.status === 402) {
          alertError('Invalid password')
        } else if (response.status === 500) {
          alertError('Server Error')
        } else if (response.status === 200) {
          toast.success('Login successful')
          document.cookie = `jwt=${response.data.cookie.jwt}; path=/`;
          document.cookie = `sessionId=${response.data.sessionId}; path=/`;
                    // console.log(response)
          return response.data.user
        }
      } catch (error) {
        LogError(error)
        throw(error)
      }
  
}

