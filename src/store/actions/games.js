import { ADD_GAME } from './actionTypes'

export const addGAme = (gameDetails) => {
    return {
        type: ADD_GAME,
        gameDetails: gameDetails
    }
}