export const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`);
    
    // Only return stack traces in development
    const statusCode = err.statusCode || 500;
    
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
