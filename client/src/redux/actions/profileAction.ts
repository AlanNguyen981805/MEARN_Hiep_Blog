import { Dispatch } from "redux";
import { checkTokenExp } from "../../utils/checkTokenExp";
import { getApi, patchAPI } from "../../utils/FetchData";
import { checkImg, imageUpload } from "../../utils/ImgUpload";
import { IUserProfile } from "../../utils/TypeScript";
import { checkPassword } from "../../utils/Valid";
import { ALERT, IAlertType } from "../types/alertType";
import { AUTH, IAuth, IAuthType } from "../types/authType";
import { GET_OTHER_INFO, IGetOtherInfoType } from "../types/profileType";

export const updateUser = (avatar: File, name: string, auth: IAuth) => 
async(dispatch: Dispatch<IAlertType | IAuthType>) => {
    if(!auth.access_token || !auth.user) return;
    let url = ''
    try {
        const result = await checkTokenExp(auth.access_token, dispatch)
        const access_token = result ? result : auth.access_token
        dispatch({
            type: ALERT,
            payload: {
                loading: true
            }
        })

        if(avatar) {
            const check = checkImg(avatar)
            if(check) 
                return dispatch({
                    type: ALERT,
                    payload: {errors: check}
                })

            const photo = await imageUpload(avatar)
            url = photo.url

            dispatch({
                type: AUTH,
                payload: {
                    access_token: access_token,
                    user: {
                        ...auth.user,
                        avatar: url ? url : auth.user.avatar,
                        name: name ? name: auth.user.name
                    }
                    
                }
            })

            const res = await patchAPI('user', {
                avatar: url ? url : auth.user.avatar,
                name: name ? name: auth.user.name
            }, access_token)
            
            dispatch({
                type: ALERT,
                payload: {success: res.data.msg}
            })
            
        }

        dispatch({
            type: ALERT,
            payload: {
                loading: false
            }
        })
    } catch (error: any) {
        dispatch({
            type: ALERT,
            payload: {
                errors: error.response.data.msg
            }
        })
    }
}

export const resetPassword = (
    password: string, cf_password: string, token: string
) => async(dispatch: Dispatch<IAlertType | IAuthType>) => {
    const msg = checkPassword(password, cf_password)
    if(msg) return dispatch({type: ALERT, payload: {errors: msg}})
    try {
        const result = await checkTokenExp(token, dispatch)
        const access_token = result ? result : token
        dispatch({
            type: ALERT,
            payload: {
                loading: true
            }
        })
        const res = await patchAPI('reset_password', {password}, access_token)

        dispatch({
            type: ALERT,
            payload: {
                loading: false,
                success: 'succcc'
            }
        })
    } catch (error: any) {
        dispatch({
            type: ALERT,
            payload: {
                errors: error.response.data.msg
            }
        })
    }
}

export const getOtherInfo = (id: string) => async (dispatch: Dispatch<IAlertType | IGetOtherInfoType>) => {
    try {
        dispatch({
            type: ALERT,
            payload: {
                loading: true
            }
        })
        const res = await getApi(`user/${id}`)
        dispatch({
            type: GET_OTHER_INFO,
            payload: res.data
        })

        dispatch({
            type: ALERT,
            payload: {
                loading: false,
                success: 'succcc'
            }
        })
    } catch (error) {
        
    }
}