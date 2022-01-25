import { GET_BLOGS_CATEGORY_ID, GET_BLOGS_USER_ID, IBlogsCategory, IBlogsUser, IGetBlogsCategoryType, IGetBlogsUserType } from "../types/blogType";

const userBlogsReducer = (
    state: IBlogsUser[] = [], 
    action: IGetBlogsUserType
): any => {
    switch (action.type) {
        case GET_BLOGS_USER_ID:
            if(state.every(item => item.id !== action.payload.id)) {
                return [...state, action.payload]
            } else {
                return state.map(blog => (
                    blog.id === action.payload.id ? action.payload: blog
                ))
            }
        default:
            return state;
    }
}

export default userBlogsReducer;