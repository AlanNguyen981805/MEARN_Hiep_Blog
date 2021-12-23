import { applyMiddleware, compose, createStore } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducers from "./reducers"
import thunk from "redux-thunk"
declare global {
    interface Window {
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducers,
    composeEnhancers(applyMiddleware(thunk))
)

export default store;