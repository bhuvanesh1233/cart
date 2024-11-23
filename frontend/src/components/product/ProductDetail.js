// ProductDetail.js
import React, { Fragment, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../../actions/productActions";
import Loader from "../Loader";
import MetaData from "../layouts/MetaData";
import { toast } from "react-toastify";
import {Carousel, carousel} from "react-bootstrap"
const ProductDetail = () => {
    const dispatch = useDispatch();
    const { id } = useParams();

    // Access the product state from Redux
    const { product, loading, error } = useSelector((state) => state.productState);

    // Fetch product data if not found locally
    useEffect(() => {
        if (!product || product._id !== id) {
            dispatch(getProduct(id));
        }
    }, [dispatch, id, product]);

    // Display error messages in toast notifications
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    return (
        <Fragment>
            <MetaData title={product ? product.name : "Product Detail"} />
            {loading ? (
                <Loader />
            ) : product ? (
                <div className="product-detail-container">
                    <h1>Product Details</h1>
                    <div className="product-detail">
                        <div className="product-image">
                        <Carousel>
                                {product.images && product.images.map((image) => (
                                    <Carousel.Item key={image._id}>
                                        <img src={image.image} alt={product.name} />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </div>
                        <div className="product-info">
                            <h1>{product.name}</h1>
                            <h5>
                                Description:
                            </h5>
                            <p>{product.description}</p>
                            <p>Price: ${product.price}</p>
                            <div className="rating-container">
                <div
                  className="stars"
                  style={{ '--rating': product.ratings }}
                >
                  ★★★★★
                </div>
        
        <span className="rating-text">({product.numOfReviews} reviews)</span>
      </div>
      
<p>Category: {product.category}</p>
<p>Seller: {product.seller}</p>
<p id="stock-status">
    Stock: <span className={product.stock > 0 ? "green-color" : "red-color"}>
        {product.stock > 0 ? "In Stock" : "Out of Stock"}
    </span>
</p>

<button disabled={product.stock === 0} className={product.stock > 0 ? "green-color" : "red-color"}>
  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
</button>

                        </div>
                    </div>

                    <div className="reviews-section">
    <h2>Customer Reviews</h2>
    {product.reviews?.length > 0 ? (
        product.reviews.map((review, index) => (
            <div key={index} className="review">
                <h3>{review.name}</h3>  {/* Reviewer's name */}
                <p>{review.comment}</p>  {/* Review content */}
                <div className="review-rating">
                    <span>Rating: {review.rating}</span> {/* Optional: Rating */}
                </div>
            </div>
        ))
    ) : (
        <p>No reviews yet</p>
    )}
</div>

                </div>
            ) : (
                <p>Product not found.</p>
            )}
        </Fragment>
    );
};

export default ProductDetail;
