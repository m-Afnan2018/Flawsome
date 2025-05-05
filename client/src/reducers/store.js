import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "../slices/userSlice";
import productSlice from "slices/productSlice";
import siteSlice from "slices/siteSlice";


const rootReducer = combineReducers({
    user: userSlice,
    products: productSlice,
    site: siteSlice,
})

export default rootReducer;