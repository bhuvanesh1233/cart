const catchAsyncError = require("../middlewares/catchAsyncError");
const Order = require("../models/orderModel");
const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorHandler");


//create new order - {{base_url}}/api/v1/order/new

exports.newOrder = catchAsyncError( async (req, res, next)=>{
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalprice,
        paymentInfo
    } = req.body;

const order = await Order.create({

    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalprice,
    paymentInfo,
    paidAt:Date.now(),
    user:req.user.id

})

res.status(201).json({
    sucess:true,
    order
})
})


//get single order - {{base_url}}/api/v1/order/:id

exports.getSingleOrder = catchAsyncError(async (req, res, next)=>{

 
   const order = await Order.findById(req.params.id).populate('user','name email')

   if(!order){
    return next(new ErrorHandler(`order not found with this id:${req.params.id}`,404))
   }

   res.status(201).json({
    sucess:true,
    order
   })

}
)


//get logged users orders - {{base_url}}/api/v1/myorders

exports.myOrders = catchAsyncError(async(req, res, next)=>{
    const orders = await Order.find({user: req.user.id})
    res.status(201).json({
        sucess:true,
        count:orders.length,
        orders
    })
})


//Admin: get all orders - {{base_url}}/api/v1/Admin/orders

exports.orders = catchAsyncError(async(req, res, next)=>{
    const orders = await Order.find()

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice
    });
    res.status(201).json({
        success:true,
        count:orders.length,
        totalAmount,
        orders

    })
})


// Admin update order / order status - {{base_url}}/api/v1/Admin/order/:id

exports.updateOrder = catchAsyncError(async (req, res, next)=>{

 
      const order = await Order.findById(req.params.id).populate('user','name email')
 
    if(order.orderStatus == "Delivered"){
     return next(new ErrorHandler(`order has already been delivered`,400))
    }
 
    order.orderItems.forEach(async orderItem =>{

        await updateStock(orderItem.product, orderItem.quantity)

    })
    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now()
    await order.save()

    res.status(201).json({
     sucess:true
    })
 
 })

 async function updateStock(productId, quantity) {
    const product = await Product.findById(productId);
    product.stock = product.stock - quantity;
    product.save({validateBeforeSave: false})
 }



 //Admin delete order - {{base_url}}/api/v1/Admin/deleteOrder/:id

 exports.deleteOrder = catchAsyncError(async (req, res, next)=>{
    const order = await Order.findByIdAndDelete(req.params.id)
    if(!order){
        return next(new ErrorHandler(`order not found with this id:${req.params.id }`,404))

    }
    res.status(201).json({
        success:true
    })
 })