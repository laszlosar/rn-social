import { createStore, combineReducers, compose } from 'redux';
import { gameReducer, navReducer, userReducer } from './reducers';

const rootReducer = combineReducers({
    games: gameReducer,
    navigator: navReducer,
    user: userReducer,
})

let composeEnhancers = compose;

if(__DEV__){
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
}

const configureStore = () => {
    return createStore(rootReducer, composeEnhancers());
}

export default configureStore;