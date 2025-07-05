const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    const error = {
      message: err.message || 'Internal Server Error',
      status: err.status || 500,
      timestamp: new Date().toISOString()
    };
    
    res.status(error.status).json(error);
  };
  
  module.exports = errorHandler;