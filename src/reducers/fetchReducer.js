import {
    FETCHING_DATA, FETCHING_DATA_FAILURE, FETCHING_DATA_SUCCESS,
    FETCHING_DATA_FAILURE_NETWORK, FETCHING_DATA_NETWORK, FETCHING_DATA_SUCCESS_NETWORK,
    FETCHING_AREA_DATA, FETCHING_AREA_DATA_FAILURE, FETCHING_AREA_DATA_SUCCESS
} from '../constans'
const initialState = {
    user: [],
    areas: [],
    isFetching: false,
    isError: false,
    user_network: []
}

export default (state = initialState, { type, payload }) => {
    switch (type) {

        case FETCHING_DATA:
            return { ...state, isFetching: true, user: [] }
        case FETCHING_DATA_SUCCESS:
            return { ...state, isFetching: false, user: payload, }
        case FETCHING_DATA_FAILURE:
            return { ...state, isFetching: false, isError: true }
        case FETCHING_AREA_DATA:
            return { ...state, isFetching: true, areas: [] }
        case FETCHING_AREA_DATA_SUCCESS:
            return { ...state, isFetching: false, areas: payload, }
        case FETCHING_AREA_DATA_FAILURE:
            return { ...state, isFetching: false, isError: true }
        case FETCHING_DATA_NETWORK:
            return { ...state, isFetching: true, user_network: [] }
        case FETCHING_DATA_SUCCESS_NETWORK:
            return { ...state, isFetching: false, user_network: payload, }
        case FETCHING_DATA_FAILURE_NETWORK:
            return { ...state, isFetching: false, isError: true }
        default:
            return state
    }
}
