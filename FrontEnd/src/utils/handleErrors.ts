import { toast } from "react-custom-alert"

export function LogError(error: any){
    console.log("Full error: ", error)
    console.log("In ERor handler function: ", error?.response?.data?? error)
    toast.error(error?.response?.data.message ?? null)
    if (error?.response?.data){
        if (error?.response?.data?.code === "P2002"){
            {
                // console.log("Here")
            return `${error?.response?.data?.meta?.target} already in use`
        }}
    }
    return ""
}