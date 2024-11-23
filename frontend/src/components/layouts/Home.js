// Home.js
import React, { Fragment, useEffect, useState } from 'react';
import MetaData from './MetaData';
import { getProducts } from '../../actions/productsActions';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Loader';
import Product from '../product/Product';
import { toast } from 'react-toastify';
import Pagination from "react-js-pagination"
const Home = () => {
    const dispatch = useDispatch();
    const { products, loading, error,productsCount,resPerPage } = useSelector((state) => state.productsState);
    const [currentPage,setcurrentPage] = useState(1)
    useEffect(() => {
      dispatch(getProducts(currentPage,null,null,null,null));
  }, [dispatch,currentPage]);

  // Display toast when there's an error
  useEffect(() => {
      if (error) {
          toast.error(error); // Show error in toast
      }
  }, [error]); // Only run this effect when `error` changes
const setcurrentPageNo = (pageNo)=>{
setcurrentPage(pageNo)

}
console.log(currentPage)

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <div className="home-container">
                    <MetaData title={'Buy Best Products'} />
                    <h1>Welcome to BhuviCart</h1>
                    <div className="product-grid">
                        {products && products.map((product) => (
                            <Product key={product._id} product={product} />
                        ))}
                    </div>
                    {productsCount>0 && productsCount>resPerPage?
                    <div className='d-flex justify-content-center mt-5'>

                        <Pagination
                        activePage={currentPage}
                        onChange={setcurrentPageNo}
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
                    :null}
                </div>
              
            )}
        </Fragment>
    );
};

export default Home;
