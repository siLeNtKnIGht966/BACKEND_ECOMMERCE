// message, status code, error code: are for frontend to unique identify the error., error

export class HttpException extends Error {
    errorCode:ErrorCodes;
    statusCode:number;
    errors:any
    constructor(message:string,errorCode:ErrorCodes,statusCode:number,errors:any){
        super(message)
        this.errorCode = errorCode
        this.statusCode = statusCode
        this.errors=errors
    }

}

export enum ErrorCodes {
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXISTS = 1002,
    INCORRECT_PASSWORD = 1003,
    UNPROCESSABLE_ENTITY = 1004,
    INTERNAL_EXCEPTION = 1005

}
