class ExpressError extends Error {

    constructor (message, statusCode){
    
        super();
    
        this.message= message;
        this.statusCode=statusCode;
    }
    
    }
    
    // generic error 
    
    module.exports = ExpressError;