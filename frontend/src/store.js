import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {thunk} from "redux-thunk";  // Importing thunk middleware
import productsReducer from "./slices/productsSlice";
import productReducer from "./slices/productSlice"
// Combine your reducers
const reducer = combineReducers({
  productsState: productsReducer,
  productState:productReducer
});

// Create the store with redux-thunk explicitly added
const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk), // Explicitly adding thunk to the middleware
});

export default store;
