import { IAlert } from './../../utils/TypeScript';
import { ALERT } from './../types/alertType';
 
const alertReducer = (state: IAlert = {}, action: any): IAlert => {
    switch(action.type) {
        case ALERT:
            return action.payload
        
        default: 
            return state
    }
}

export default alertReducer