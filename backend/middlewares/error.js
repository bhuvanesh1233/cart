const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    // Default status code to 500 (Internal Server Error) if not provided
    err.statusCode = err.statusCode || 500;

    // Development environment: return full error details
    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            success: false,
            error: err,           // The full error object, including name and stack trace
            message: err.message, // Error message
            stack: err.stack      // Stack trace for debugging
        });
    }

    // Production environment: sanitize the error output
    if (process.env.NODE_ENV === 'production') {
        let message = err.message;
        let error = new ErrorHandler(message, err.statusCode || 500); // Initialize custom error handler
    
        // Handle Mongoose validation errors
        if (err.name === 'ValidationError') {
            message = Object.values(err.errors).map(value => value.message).join(', ');
            error = new ErrorHandler(message, 400); // Bad request error
            err.statusCode = 400
        }
    
        // Handle Mongoose duplicate key error (code 11000)
        if (err.code === 11000) {
            message = `Duplicate field value: ${Object.keys(err.keyValue).join(', ')}. Please use a unique value.`;
            error = new ErrorHandler(message, 400);
        }
        // Send a simplified error response in production
        return res.status(err.statusCode).json({
            success: false, // Fixed typo from `sucess` to `success`
            message: error.message || 'Internal Server Error'
        });
    }
};
