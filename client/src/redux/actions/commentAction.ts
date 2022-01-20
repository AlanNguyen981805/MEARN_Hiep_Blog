import { Dispatch } from "redux";
import { getApi, postApi } from "../../utils/FetchData";
import { ALERT, IAlertType } from "../types/alertType";
import { CREATE_COMMENT, GET_COMMENT, ICreateCommentType, IGetCommentType } from "../types/commentType";

export const createComment = (data: any, token: string) => async (dispatch: Dispatch<IAlertType | ICreateCommentType>) => {
    try {

        const res = await postApi('comment', data, token)
        dispatch({
            type: CREATE_COMMENT,
            payload: {
                ...res.data,
                user: data.user
            }
        })
    } catch (error: any) {
        dispatch({ type: ALERT, payload: error.response.message })
    }
}
export const getComments = (id: string) => async (dispatch: Dispatch<IAlertType | IGetCommentType>) => {
    try {
        const res = await getApi(`comments/blog/${id}`)
        dispatch({
            type: GET_COMMENT,
            payload: {
                data: res.data.comments,
                total: res.data.total
            }
        })
    } catch (error: any) {
        dispatch({ type: ALERT, payload: error.response.message })
    }
}