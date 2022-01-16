import { GET_BLOGS_CATEGORY_ID } from './../types/blogType';
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

export const getBlogsByCategoryId = (id: string) =>async (dispatch: Dispatch<IAlertType | IGetBlogsCategoryType>) => {
    try {
        dispatch({ type: ALERT, payload: {loading: true}})
        const res = await getApi(`blogs/${id}`)
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


