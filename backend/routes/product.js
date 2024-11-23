const express = require ("express");
const { getProducts, newProduct, getSingleProduct, updateProduct,deleteProduct, createReview, getReviews, deleteReview } = require("../controllers/productController");
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles} = require("../middlewares/authenticate")

router.route('/products').get(getProducts)
router.route('/product/:id').get(getSingleProduct).delete(deleteProduct)
router.route('/product/:id').put(updateProduct)
router.route('/product/:id').put(updateProduct)
router.route('/review').put(isAuthenticatedUser, createReview)
                       .get(isAuthenticatedUser,getReviews)
                       .delete(isAuthenticatedUser,deleteReview)
//admin
router.route('/product/new').post(isAuthenticatedUser,authorizeRoles('admin'),newProduct)
               
module.exports = router;