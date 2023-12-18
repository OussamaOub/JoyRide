import axios from "axios";
import { apiurl } from "../context/apiurl";

export async function logout() {
    // Clear the JWT token from cookies (assuming the cookie is named 'jwt')
    
    const res = await axios.get(`${apiurl}/api/user/logout`, {
      withCredentials: true
    })

    if(res.status === 200)
    
    {document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    document.cookie= "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";


  
    // Optionally, you can also clear the token from local storage if it's stored there
    // localStorage.removeItem('jwt');
  
    // Perform any additional client-side cleanup if needed
  
    // Redirect the user to the login page or any other desired location
    window.location.href = '/';} // You can specify the URL to redirect to
  }
  