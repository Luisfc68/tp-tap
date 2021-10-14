import CustomError from "./CustomError";

export default class DaoError extends CustomError{

    constructor(msg:string,modifier?:string){
        super(msg,modifier);
        //Object.setPrototypeOf(this,CustomError.prototype);
    }

}