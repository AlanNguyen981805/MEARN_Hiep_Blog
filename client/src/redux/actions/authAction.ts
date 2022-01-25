import { ALERT, IAlertType } from './../types/alertType';
import { Dispatch } from "redux";
import { postApi, getApi } from "../../utils/FetchData";
import { IUserLogin, IUserRegister } from "../../utils/TypeScript";
import { AUTH, IAuthType } from "../types/authType";
import { validRegister } from '../../utils/Valid';
import { checkTokenExp } from '../../utils/checkTokenExp';

export const login = (userLogin: IUserLogin) => async (dispatch: Dispatch<IAuthType | IAlertType >) => {
    try {
        dispatch({
            type: ALERT, 
            payload: {
                loading: true
            }
        })
        const res = await postApi('login', userLogin)
        
        dispatch({
            type: 'AUTH',
            payload: res.data
        })

        dispatch({
            type: ALERT, 
            payload: {
                loading: false,
                success: "Login thanh cong"
            }
        })
        localStorage.setItem('logged', 'true')
    } catch (error: any) {
        dispatch({
            type: ALERT, 
            payload: {
                errors: error.response.data.msg
            }
        })
        console.log(error.response.data.msg);
        
    }
}

export const loginGoogle = (id_token: string) =>async (dispatch: Dispatch<IAlertType | IAuthType>) => {
    try {
        dispatch({
            type: ALERT,
            payload: {loading: true}
        })
        const res = await postApi('google_login',{id_token})
        dispatch({
            type: AUTH,
            payload: res.data
        })
        dispatch({
            type: ALERT,
            payload: {success: res.data.msg}
        })
        localStorage.setItem('logged', 'true')
    } catch (error: any) {
        dispatch({
            type: ALERT,
            payload: {errors: error.response.data.msg}
        })
    }
}

export const loginFacebook = (accessToken: string, userID: string) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    try {
        dispatch({
            type: ALERT,
            payload: {loading: true}
        })
        const res = await postApi('facebook_login', {accessToken, userID})
        dispatch({
            type: AUTH,
            payload: res.data
        })
        dispatch({
            type: ALERT,
            payload: {success: res.data.msg}
        })
        localStorage.setItem('logged', 'true')
        
    } catch (error: any) {
        dispatch({
            type: ALERT,
            payload: {errors: error.response.data.msg}
        })
    }
}

export const logout = (token: string) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    const result = await checkTokenExp(token, dispatch)
    const access_token = result ? result : token
    localStorage.removeItem('logged')

    await getApi('logout', access_token)
    window.location.href = '/'
} 

export const register = (userRegister: IUserRegister) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    console.log(userRegister);
    const check = validRegister(userRegister)
    if(check.errLengh > 0) {
        return dispatch({
            type: ALERT,
            payload: {
                errors: check.errMSG
            }
        })
    }

    try {
        dispatch({
            type: ALERT,
            payload: {
                loading: true
            }
        })

        const res = await postApi('register', userRegister)
        console.log(res );
        
        dispatch({
            type: ALERT,
            payload: {
                success: res.data.msg
            }
        })
    } catch (error: any) {
        dispatch({
            type: ALERT, 
            payload: {
                errors: error.response.data.msg
            }
        })
        console.log(error.response.data.msg);
    }
}

export const refesh_token = () => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    const logged = localStorage.getItem('logged')
    console.log(">>>>",logged );
    
    if(logged !== 'true') return
        try {
            dispatch({type: ALERT, payload: {loading: true}})

            const res = await getApi('refresh_token')
            dispatch({ type: AUTH,payload: res.data })

            dispatch({ type: ALERT, payload: { } })
        } catch (error: any) {
            dispatch({type: ALERT, payload: {loading: false}})
            console.log(error.response);
            
        }
}

