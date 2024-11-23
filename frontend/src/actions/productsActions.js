// productsActions.js
import axios from "axios";
import { productsFail, productsRequest, productsSuccess } from "../slices/productsSlice";

export const getProducts = (page = 1, keyword = '', priceRange = [0, 1000],category,rating) => async (dispatch) => {
    try {
        dispatch(productsRequest());
        
        // Construct URL with page, keyword, and priceRange query parameters
        let link = `/api/v1/products?page=${page}`;  // You can adjust the limit as needed
        if (keyword) {
            link += `&keyword=${keyword}`;
        }
        if (priceRange) {
            link += `&price[gte]=${priceRange[0]}&price[lte]=${priceRange[1]}`;
        }
        if (category) {
            link += `&category=${category}`;
        }
        if (rating) {
            link += `&ratings[gte]=${rating}`;
        }
        

        // Make the API call
        const { data } = await axios.get(link);

        // Dispatch success with the fetched data
        dispatch(productsSuccess(data));
    } catch (error) {
        // Dispatch error if the request fails
        dispatch(productsFail(error.response.data.message));
    }
};
