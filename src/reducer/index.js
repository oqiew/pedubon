import User_reducer from './User_reducer';
import { combineReducers } from 'redux';
const allReduxcers = combineReducers({
    User: User_reducer
})

export default allReduxcers;
