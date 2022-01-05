import { GET_CATEGORIES } from './../types/categoryType';
import { Dispatch } from 'redux';
import { getApi, postApi } from '../../utils/FetchData';
import { IAuthType } from '../types/authType';
import { CREATE_CATEGORY, ICategoryType } from '../types/categoryType';
import { ALERT, IAlertType } from './../types/alertType';

export const createCategory = (
    name: string, token: string
) => async(dispatch: Dispatch<IAlertType | ICategoryType>) => {
    try {
        dispatch({type: ALERT, payload: {loading: true}})

        const res = await postApi('category', {name}, token)
        
        dispatch({
            type: CREATE_CATEGORY,
            payload: res.data.newCategory
        })
        dispatch({type: ALERT, payload: {loading: false}})
        
    } catch (error: any) {
        dispatch({type: ALERT, payload: {
            errors: error.response.data.msg
        }})
    }
}

export const getCategory = () => async(dispatch: Dispatch<IAlertType |  ICategoryType>) => {
    try {
        dispatch({type: ALERT, payload: {loading: true}})
        const res = await getApi('category')
        
        dispatch({
            type: GET_CATEGORIES,
            payload: res.data.categories
        })
        dispatch({type: ALERT, payload: {loading: false}})
        
    } catch (error: any) {
        dispatch({type: ALERT, payload: {
            errors: error.response?.data?.msg
        }})
    }
}