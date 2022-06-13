class CustomerrorHandler extends Error {
    constructor(status, msg) {
        super();
        this.status = status;
        this.message = msg;
    }

    static alreadyExist(message) {
        return new CustomerrorHandler(409, message);
    }
    static wrongCrendentials(message = 'Username or password is wrong') {
        return new CustomerrorHandler(401, message);
    }
    static unAuthorized(message = 'unAuthorized') {
        return new CustomerrorHandler(401, message);
    }
    static notFound(message = '404 not found') {
        return new CustomerrorHandler(404, message);
    }
    static serverError(message = 'Internal server error') {
        return new CustomerrorHandler(500, message);
    }
}

export default CustomerrorHandler;