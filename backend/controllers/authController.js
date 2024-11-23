const catchAsyncError = require("../middlewares/catchAsyncError")
const sendEmail = require("../utils/email")
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt")
const crypto = require("crypto")

//Register user - {{base_url}}/api/v1/register
exports.registerUser = catchAsyncError(async(req,res,next) => {
    const {name, email, password, avatar} = req.body
    const user = await User.create({
        name,
        email,
        password,
        avatar
    })
    sendToken(user,201,res)
    });

//Login user - {{base_url}}/api/v1/login
exports.loginUser = catchAsyncError(async(req, res, next)=>{

    const {email, password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler("please enter email and password",400)
        )
    }

   const user = await User.findOne({email}).select('+password')

   if(!user){
    return next(new ErrorHandler("Invalid email or password",401))

   }
   
   if( !await user.isValidPassword(password)){

    return next(new ErrorHandler("Invalid email or password",401))
   
  }
sendToken(user,201,res)
  
})


//Logout user - {{base_url}}/api/v1/logout

exports.logoutUser = (req, res, next)=>{

    res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly:true
    }).status(200)
      .json({
        sucess: true,
        message:"LoggedOut"
      })
}


// forgetpassword user - {{base_url}}/api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next)=>{

   const user = await User.findOne({email:req.body.email})

   if(!user){
    return next (new ErrorHandler("user not found with this email",404))
   }

   const resetToken = user.getResetToken()

   await user.save({validateBeforeSave:false})

   //creat reset url
   const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`
   const message = `your password reset url is as follows \n\n
   ${resetUrl}\n\n
   If you have not requested this email, then ignore it`

   try{

    sendEmail({
        email:user.email,
        subject: "BHUVICart password recovery",
        message
    })
    res.status(200).json({
        sucess:true,
        message:`email send to ${user.email}` 
    })
    
   }catch(error){
    user.resetPasswordTokenExpire = undefined
    user.resetPasswordTokenExpire = undefined
    await user.save({
        validateBeforeSave:false
    })
    return next(new ErrorHandler(error.message),500)
   }
})


//resetpassword - {{base_url}}/api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async(req, res, next)=>{

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire:{
            $gt: Date.now()
        }
         })
    if(!user){
        return next(new ErrorHandler("password reset token is invalild or expired"))
}

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('password does not match'))
    }

    user.password = req.body.password;
    user.resetPasswordToken =undefined;
    user.resetPasswordTokenExpire = undefined;

    await user.save({
        validateBeforeSave:false
    })

    sendToken(user, 201, res)
})



//get user profile - {{base_url}}/api/v1/myprofile

exports.getUserProfile = catchAsyncError(async (req, res, next)=>{
    const user = await User.findById(req.user.id)
    res.status(201).json({
        sucess:true,
        user
    })
})

//change password - {{base_url}}/api/v1/password/change

exports.changePassword = catchAsyncError(async (req, res, next)=>{
    const user = await User.findById(req.user.id).select('+password')

    //check old password
    if(! await user.isValidPassword(req.body.oldPassword)){
        return next(new ErrorHandler("old password is incorrect")
        )
    }
    user.password = req.body.password;
    await user.save();

    res.status(201).json({
        sucess:true,
        message: `password sucessfully changed`
    })
}) 


//update profile - {{base_url}}/api/v1/update

exports.updateProfile = catchAsyncError( async (req, res, next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role: req.body.role
    }
     
    const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserData,{
        new:true,
        runValidators:true
    })
    res.status(201).json({
        sucess: true,
        updatedUser
    })
})


//admin: Get all users - {{base_url}}/api/v1/Admin/users

exports.getAllUsers = catchAsyncError(async (req, res, next)=>{
    const users = await User.find()
    res.status(201).json({
        sucess:true,
        users
    })
})

//Admin: Get specific users - {{base_url}}/api/v1/Admin/user/:id

exports.getUser = catchAsyncError(async (req, res, next)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        return next(new ErrorHandler(`user not found with this id ${req.params.id}`))
    }
    res.status(201).json({
        sucess:true,
        user
    })
})

//Admin: update user data - {{base_url}}/api/v1/Admin/user/:id

exports.updateUser = catchAsyncError( async (req, res, next)=>{
    const newUserData ={
        name:req.body.name,
        email:req.body.email,
        role: req.body.role
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, newUserData,{
        new:true,
        runValidators:true
    })
    res.status(201).json({
        sucess: true,
        updatedUser
    })
})


//Admin: Delete user - {{base_url}}/api/v1/Admin/user/:id 

exports.deleteUser = catchAsyncError(async (req, res, next)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        return next(new ErrorHandler(`user not found with this id ${req.params.id}`))
    }

    await user.deleteOne()
    res.status(201).json({
        sucess: true
        
    })

})