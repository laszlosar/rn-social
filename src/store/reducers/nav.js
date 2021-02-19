import { ROOT_NAV } from '../actions/actionTypes';

const initialState = {
    rootNav: null
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case ROOT_NAV:
            return {
                ...state,
                rootNav : action.rootNav
            }
        break;
        default:
            return state;
    }
}

export default reducer;