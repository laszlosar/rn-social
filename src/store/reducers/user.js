import { SET_USER } from '../actions/actionTypes';

const initialState = {
    user: null
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case SET_USER:
            return {
                ...state,
                user : action.user
            }
        break;
        default:
            return state;
    }
}

export default reducer;