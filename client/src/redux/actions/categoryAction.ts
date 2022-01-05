import { ICategory } from './../../utils/TypeScript';
import { 
    GET_CATEGORIES, 
    ICategoryType, 
    UPDATE_CATEGORY, 
    CREATE_CATEGORY,
    DELETE_CATEGORY
} 
from './../types/categoryType';
import { Dispatch } from 'redux';
import { deleteAPI, getApi, patchAPI, postApi } from '../../utils/FetchData';
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

export const updateCategory = (data: ICategory, token: string) => async(dispatch: Dispatch<ICategoryType | IAlertType>) => {
    try {
        dispatch({
            type: UPDATE_CATEGORY,
            payload: data
        })
        dispatch({type: ALERT, payload: {loading: true}})
        const res = await patchAPI(`category/${data._id}`, {name: data.name}, token)
        
        dispatch({type: ALERT, payload: {loading: false}})
        
    } catch (error: any) {
        dispatch({type: ALERT, payload: {
            errors: error.response?.data?.msg
        }})
    }
}

export const deleteCategory = (id: string, token: string) => async(dispatch: Dispatch<ICategoryType | IAlertType>) => {
    try {
        dispatch({
            type: DELETE_CATEGORY,
            payload: id
        })

        const res = await deleteAPI(`category/${id}`, token)
        
    } catch (error: any) {
        dispatch({type: ALERT, payload: {
            errors: error.response?.data?.msg
        }})
    }
}