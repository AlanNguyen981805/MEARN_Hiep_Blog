import { combineReducers } from "redux";
import auth from './authReducer'
import alert from './alertReducer'
import categories from './categoryReducer'
import homeBlogs from './homeBLogsReducer'
import blogsCategory from './blogsCategoryReducer'
import otherInfo from './otherInfoReducer'
import blogsUser from './userBlogsReducer'
import comments from './commentReducer'

export default combineReducers({
    auth,
    alert,
    categories,
    homeBlogs,
    blogsCategory,
    otherInfo,
    blogsUser,
    comments
})