import { ROOT_NAV } from './actionTypes'

export const setNavigator = (rootNav) => {
    return {
        type: ROOT_NAV,
        rootNav: rootNav
    }
}