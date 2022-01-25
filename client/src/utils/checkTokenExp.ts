import axios from "axios";
import jwt_decode from "jwt-decode";
import { AUTH } from "../redux/types/authType";
import { getApi } from "./FetchData";

interface IToken {
    exp: number
    iat: number
    id: string
}

export const checkTokenExp = async (token: string, dispatch: any) => {
    const decode: IToken = jwt_decode(token)
    if(decode.exp > Date.now() / 1000) return

    const res = await getApi('/refresh_token')
    dispatch({
        type: AUTH,
        payload: res.data
    })
    return res.data.access_token
}