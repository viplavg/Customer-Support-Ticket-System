export class ApiError extends Error {
    constructor(statusCode, message)  {
        super(message); //Parent Error constructor call
        this.statusCode = statusCode;
        this.name = "ApiError";
    }
}