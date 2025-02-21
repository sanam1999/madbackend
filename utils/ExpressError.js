class ExpressError extends Error{
    constructor(statuscode = 500, message = "Something went wrong"  ) {
        super();
        this.message = message
        this.statuscode = statuscode;
    }
}

module.exports = ExpressError;