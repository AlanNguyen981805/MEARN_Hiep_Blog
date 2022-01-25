import { Dispatch } from "redux";
import { getApi, postApi } from "../../utils/FetchData";
import { IComment } from "../../utils/TypeScript";
import { ALERT, IAlertType } from "../types/alertType";
import { CREATE_COMMENT, GET_COMMENT, ICreateCommentType, IGetCommentType, IReplyCommentType, REPLY_COMMENT } from "../types/commentType";

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
export const getComments = (id: string, num: number) => async (dispatch: Dispatch<IAlertType | IGetCommentType>) => {
    try {
        let limit = 4;
        const res = await getApi(`comments/blog/${id}?page=${num}&limit=${limit}`)
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

export const replyComments = (data: IComment, token: string) => async (dispatch: Dispatch<IAlertType | IReplyCommentType>) => {
    try {
        const res = await postApi('reply_comment', data, token)
        
        // dispatch({
        //     type: REPLY_COMMENT,
        //     payload: {
        //         ...res.data,
        //         user: data.user,
        //         reply_user: data.reply_user
        //     }
        // })
    } catch (error) {
        console.log(error)
    }
}