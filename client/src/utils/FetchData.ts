import axios from "axios"

export const postApi = async (url: string, post: object, token?: any) => {
    console.log(url);
    
    const res = await axios.post(`/api/${url}`, post, {
        headers: { Authorization: token }
    })

    return res
}

export const getApi = async (url: string, token?: any) => {
    const res = await axios.get(`/api/${url}`, {
        headers: { Authorization: token }
    })
    return res
}

export const patchAPI = async (url: string, post: object, token?: any) => {
    const res = await axios.patch(`/api/${url}`, post, {
        headers: { Authorization: token }
    })
    return res
}