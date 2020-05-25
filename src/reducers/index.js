import { combineReducers } from "redux";
import fetchReducer from "./fetchReducer";

// ตัวรวม deducer

export default combineReducers({ fetchReducer, });