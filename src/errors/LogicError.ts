import CustomError from "./CustomError";

export default class LogicError extends CustomError{

    constructor(msg:string,modifier?:string){
        super(msg,modifier);
    }

}