const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError")
const APIFeatures = require("../utils/apiFeatures")



//Get products - /api/v1/products
exports.getProducts = catchAsyncError(async (req,res,next)=>{
    const resPerPage = 4;
    const page = Number(req.query.page) || 1;
    let buildQuery=()=>{

        return new APIFeatures(Product.find(), req.query).search().filter()
    }    
    const filteredProductsCount = await buildQuery().query.countDocuments({})
    const products = await buildQuery().paginate(resPerPage,page).query
    const totalProductsCount = await Product.countDocuments({})
    let productsCount = totalProductsCount
    if(filteredProductsCount!==totalProductsCount){
        productsCount = filteredProductsCount
    }
  //  await new Promise(resolve=>setTimeout(resolve,3000))
  //return next(new ErrorHandler("unable to get data",400))
    res.status(200).json({
        sucess:true,
        count:productsCount,
        resPerPage,
        products
    })
})


//post products - /api/v1/product/new
exports.newProduct = catchAsyncError(async (req,res,next)=>{

    req.body.user = req.user.id
    const product = await Product.create(req.body)
    res.status(201).json({
        sucess:true,
        product
    })
})


//get single product

exports.getSingleProduct = async(req,res,next)=>{

   const product = await Product.findById(req.params.id)
   if(!product){
    return  next( new ErrorHandler("product not found test",400))
   }
     //  await new Promise(resolve=>setTimeout(resolve,3000))

   res.status(201).json({
    sucess:true,
    product
   })
}



//update product
exports.updateProduct = async(req,res,next)=>{
    let product = await Product.findById(req.params.id)
    if(!product){
        return res.status(404).json({
            sucess:false,
            message:"product not found"
        })
       }

       product = await Product.findByIdAndUpdate(req.params.id, req.body,{
              new:true,
              runValidators:true
       })

       res.status(200).json({

        success:true,
        product
       })
}



exports.deleteProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if(!product){
        return res.status(404).json({
            sucess:false,
            message:"product not found"
        })
       }
       
    await Product.findByIdAndDelete(req.params.id);

      res.status(200).json({
        sucess:true,
        message:"product deleted"
      })
}


//create review - {{base_url}}/api/v1/review

exports.createReview = catchAsyncError(async(req, res, next)=>{

    const{productId, rating, comment} = req.body

    const review = {
        user: req.user.id,
        rating: rating,
        comment:comment
    }

    const product = await Product.findById(productId)
    const isReviewed = product.reviews.find(review =>{
        return review.user && review.user.toString() === req.user.id.toString()
    })

    if(isReviewed){

        product.reviews.forEach(review =>{
            if(review.user && review.user.toString() === req.user.id.toString()){
                review.comment = comment
                review.rating = rating
            }
        })

    }else{
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc,review)=>{
        return review.rating + acc;
    },0) / product.reviews.length;
    product.ratings = isNaN(product.ratings)?0:product.ratings

    await product.save({
        validateBeforeSave:false

    })


    res.status(201).json({
        success: true,
        
    })

})
  
//get reviews - {{base_url}}/api/v1/review?id=6715cef1f78ebe427d351aae

exports.getReviews = catchAsyncError(async(req, res, next)=>{

    const product = await Product.findById(req.query.id)

    res.status(201).json({
        success: true,
        reviews:product.reviews
    })

})

//delete review - 

exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const { productId, id } = req.query;

    const product = await Product.findById(productId);

    // Check if the product exists
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    // Filter out the review with the given ID
    const reviews = product.reviews.filter(review => {
        return review._id && review._id.toString() !== id;
    });

    // Update the number of reviews
    const numOfReviews = reviews.length;

    // Recalculate the average rating
    const ratings = reviews.reduce((acc, review) => review.rating + acc, 0) / (reviews.length || 1);

    // Update the product with the new reviews, rating, and number of reviews
    await Product.findByIdAndUpdate(productId, {
        reviews,
        numOfReviews,
        ratings: isNaN(ratings) ? 0 : ratings,
    }, { new: true });

    res.status(200).json({
        success: true,
        reviews
    });
});
