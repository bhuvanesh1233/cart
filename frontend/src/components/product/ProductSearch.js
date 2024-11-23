import React, { Fragment, useEffect, useState } from 'react';
import MetaData from '../layouts/MetaData';
import { getProducts } from '../../actions/productsActions';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Loader';
import Product from '../product/Product';
import { toast } from 'react-toastify';
import Pagination from "react-js-pagination";
import { useParams } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

const ProductSearch = () => {
    const dispatch = useDispatch();
    const { products, loading, error, productsCount, resPerPage } = useSelector((state) => state.productsState);

    const [currentPage, setCurrentPage] = useState(1);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [category, setCategory] = useState('');
    const [rating, setRating] = useState(0);  // Rating filter state
    const [priceChanged, setPriceChanged] = useState([0, 1000]);
    const { keyword } = useParams();
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    useEffect(() => {
        dispatch(getProducts(currentPage, keyword, priceChanged, category, rating));
    }, [dispatch, currentPage, keyword, priceChanged, category, rating]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const setCurrentPageNo = (pageNo) => {
        setCurrentPage(pageNo);
    };

    const handlePriceChange = (newRange) => {
        setPriceRange(newRange);
    };

    const handlePriceChangeEnd = () => {
        setPriceChanged(priceRange);
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleRatingChange = (event) => {
        setRating(parseInt(event.target.value));  // Ensure the rating value is stored as a number
    };
    

    const toggleFilterMenu = () => {
        setShowFilterMenu(!showFilterMenu);
    };

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <div className="home-container">
                    <MetaData title={'Search Products'} />
                    <h1>Search Products</h1>

                    {/* Filter Menu Button on Left Side */}
                    <button onClick={toggleFilterMenu} className={`filter-toggle-button ${showFilterMenu ? 'hide' : ''}`}>
                        Filter Options
                    </button>

                    {/* Filter Overlay */}
                    <div className={`filter-overlay ${showFilterMenu ? 'show' : ''}`} onClick={toggleFilterMenu}></div>

                    {/* Filter Menu */}
                    <div className={`filter-menu ${showFilterMenu ? 'open' : ''}`}>
                        <div className="filter-header">
                            <h4>Filter Options</h4>
                            <span className="close-button" onClick={toggleFilterMenu}>&times;</span>
                        </div>

                        {/* Price Range Filter */}
                        <div className="custom-slider-container" onMouseUp={handlePriceChangeEnd}>
                            <Slider
                                className="my-custom-slider"
                                range
                                marks={{
                                    1: "$1",
                                    1000: "$1000"
                                }}
                                min={1}
                                max={1000}
                                onChange={handlePriceChange}
                                value={priceRange}
                                handleRender={(renderProps) => (
                                    <Tooltip overlay={`$${renderProps.props['aria-valuenow']}`}>
                                        <div {...renderProps.props} />
                                    </Tooltip>
                                )}
                            />
                        </div>
                        <p>Price: ${priceRange[0]} - ${priceRange[1]}</p>

                        {/* Category Filter */}
                        <div className="category-filter">
                            <label htmlFor="category">Select Category</label>
                            <select id="category" value={category} onChange={handleCategoryChange}>
                                <option value="">All Categories</option>
                                <option value="electronics">Electronics</option>
                                <option value="fashion">Fashion</option>
                                <option value="home-appliances">Home Appliances</option>
                                {/* Add more categories here */}
                            </select>
                        </div>

                        {/* Rating Filter */}
                        {/* Rating Filter */}
<div className="rating-filter">
    <h4>Minimum Rating</h4>
    <label>
        <input
            type="radio"
            name="rating"
            value="0"
            checked={rating === 0}
            onChange={handleRatingChange}  // Set onChange directly on input
        /> 
        All Ratings
    </label>
    <label>
        <input
            type="radio"
            name="rating"
            value="1"
            checked={rating === 1}
            onChange={handleRatingChange}
        /> 
        1 Star & Up
    </label>
    <label>
        <input
            type="radio"
            name="rating"
            value="2"
            checked={rating === 2}
            onChange={handleRatingChange}
        /> 
        2 Stars & Up
    </label>
    <label>
        <input
            type="radio"
            name="rating"
            value="3"
            checked={rating === 3}
            onChange={handleRatingChange}
        /> 
        3 Stars & Up
    </label>
    <label>
        <input
            type="radio"
            name="rating"
            value="4"
            checked={rating === 4}
            onChange={handleRatingChange}
        /> 
        4 Stars & Up
    </label>
</div>

                    </div>

                    {/* Product Grid */}
                    <div className={`product-grid ${showFilterMenu ? 'filter-active' : ''}`}>
                        {products && products.map((product) => (
                            <Product key={product._id} product={product} />
                        ))}
                    </div>

                    {productsCount > 0 && productsCount > resPerPage ? (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                onChange={setCurrentPageNo}
                                totalItemsCount={productsCount}
                                itemsCountPerPage={resPerPage}
                                nextPageText="Next"
                                prevPageText="Prev"
                                firstPageText="First"
                                lastPageText="Last"
                                itemClass="page-item"
                                linkClass="page-link"
                            />
                        </div>
                    ) : null}
                </div>
            )}
        </Fragment>
    );
};

export default ProductSearch;
