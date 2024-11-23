import { Link } from "react-router-dom";

export default function Product({product}){
    return(
        <Link to={`/product/${product._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
      
      
        <div className="product-card" >
      <img src={product.images[0].image} alt={product.name} />
      <h2><Link to={`/product/${product._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
      {product.name}
      </Link></h2>
      <p>${product.price.toFixed(2)}</p>
      
      {/* Displaying the rating with stars */}
      <div className="rating-container">
                <div
                  className="stars"
                  style={{ '--rating': product.ratings }}
                >
                  ★★★★★
                </div>
        
        <span className="rating-text">({product.numOfReviews} reviews)</span>
      </div>
      <Link to={`/product/${product._id}`}>
        <button className="add-to-cart">Details</button>
      </Link>
     
    </div>
    </Link>
    )
}