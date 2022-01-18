import { GET_BLOGS_CATEGORY_ID, GET_BLOGS_USER_ID, IGetBlogsUserType } from './../types/blogType';
import { IAlertType, ALERT} from './../types/alertType';
import { Dispatch } from "react";
import { IBlog } from "../../utils/TypeScript";
import { imageUpload } from '../../utils/ImgUpload';
import { getApi, postApi } from '../../utils/FetchData';
import { GET_HOME_BLOGS, IGetHomeBlogsType, IGetBlogsCategoryType    } from '../types/blogType';

export const createBlog = (blog: IBlog, token: string) =>async (dispatch: Dispatch<IAlertType>) => {
    let url
    try {
        dispatch({ type: ALERT, payload: {loading: true}})

        if(typeof (blog.thumbnail) !== 'string') {
            const photo = await imageUpload(blog.thumbnail)
            url = photo.url
        } else {
            url = blog.thumbnail
        }
        
        const newBlog = {...blog, thumbnail: url}
        const res = await postApi('/blog', newBlog, token)

        dispatch({ type: ALERT, payload: {loading: false}})
    } catch (error: any) {
        dispatch({type: ALERT, payload: {errors: error.response.data.msg, loading: false}})
    }   
}

export const getHomeBlogs = () =>async (dispatch: Dispatch<IAlertType | IGetHomeBlogsType>) => {
    try {
        dispatch({ type: ALERT, payload: {loading: true}})
        const res = await getApi('home/blogs')
        dispatch({
            type: GET_HOME_BLOGS,
            payload: res.data
        })
        
        dispatch({ type: ALERT, payload: {loading: false}})
    } catch (error: any) {
        dispatch({type: ALERT, payload: {errors: error.response.data.msg, loading: false}})
    }   
}

export const getBlogsByCategoryId = (id: string, param: any) =>async (dispatch: Dispatch<IAlertType | IGetBlogsCategoryType>) => {
    try {
        let limit = 4
        dispatch({ type: ALERT, payload: {loading: true}})
        const res = await getApi(`blogs/category/${id}?page=${param}&limit=${limit}`)
        dispatch({
            type: GET_BLOGS_CATEGORY_ID,
            payload: {
                ...res.data,
                id
            }
        })
       
        dispatch({ type: ALERT, payload: {loading: false}})
    } catch (error: any) {
        dispatch({type: ALERT, payload: {errors: error.response.data.msg, loading: false}})
    }   
}

export const getBlogsByUserId = (id: string, search: string) =>async (dispatch: Dispatch<IAlertType | IGetBlogsUserType>) => {
    try {
        let limit = 3
        let value = search ? search : `?page=${1}`; 
        dispatch({ type: ALERT, payload: {loading: true}})
        const res = await getApi(`blogs/user/${id}${value}&limit=${limit}`)
        
        dispatch({
            type: GET_BLOGS_USER_ID,
            payload: {
                ...res.data,
                id
            }
        })
       
        dispatch({ type: ALERT, payload: {loading: false}})
    } catch (error: any) {
        dispatch({type: ALERT, payload: {errors: error.response.data.msg, loading: false}})
    }   
}


