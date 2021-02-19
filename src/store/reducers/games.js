import { ADD_GAME } from '../actions/actionTypes';

const initialState = {
    games: []
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_GAME:
            return {
                ...state,
                games : state.games.concat(action.gameDetails)
            }
        break;
        default:
            return state;
    }
}

export default reducer;