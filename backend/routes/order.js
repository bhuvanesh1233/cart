const express = require("express")

const router = express.Router()
const {isAuthenticatedUser, authorizeRoles} = require("../middlewares/authenticate")
const {newOrder, getSingleOrder, myOrders, orders, updateOrder, deleteOrder} = require("../controllers/orderController")
router.route("/order/new").post(isAuthenticatedUser,newOrder)
router.route("/order/:id").get(isAuthenticatedUser,getSingleOrder)
router.route("/myorders").get(isAuthenticatedUser,myOrders)

//Admin routes
router.route("/Admin/orders").get(isAuthenticatedUser,authorizeRoles('Admin'),orders)
router.route("/Admin/order/:id").put(isAuthenticatedUser,authorizeRoles('Admin'),updateOrder)
router.route("/Admin/deleteOrder/:id").delete(isAuthenticatedUser,authorizeRoles('Admin'),deleteOrder)

module.exports = router