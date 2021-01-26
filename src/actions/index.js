// functions
import {
    FETCHING_DATA, FETCHING_DATA_FAILURE, FETCHING_DATA_SUCCESS,
    FETCHING_DATA_FAILURE_NETWORK, FETCHING_DATA_NETWORK, FETCHING_DATA_SUCCESS_NETWORK
} from '../constans'
import { isEmptyValue } from '../components/Methods'
export const setStageToScuccess = (payload) => ({
    type: FETCHING_DATA_SUCCESS,
    payload
})
export const setStageToFetching = (payload) => ({
    type: FETCHING_DATA,
})
export const setStageToFailure = (payload) => ({
    type: FETCHING_DATA_FAILURE,
})
export const setStageNetworkToScuccess = (payload) => ({
    type: FETCHING_DATA_SUCCESS_NETWORK,
    payload
})
export const setStageNetworkToFetching = (payload) => ({
    type: FETCHING_DATA_NETWORK,
})
export const setStageNetworkToFailure = (payload) => ({
    type: FETCHING_DATA_FAILURE_NETWORK,
})


export const fetch_user = (data) => {
    return (dispatch) => {
        dispatch(setStageToFetching());
        if (!isEmptyValue(data.uid)) {
            dispatch(setStageToScuccess(data));
        } else {
            dispatch(setStageToFetching());
        }

    }
}
export const fetch_user_network = (data) => {
    return (dispatch) => {
        dispatch(setStageNetworkToFetching());
        if (!isEmptyValue(data.uid)) {
            dispatch(setStageNetworkToScuccess(data));
        } else {
            dispatch(setStageNetworkToFetching());
        }

    }
}

