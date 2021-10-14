export default abstract class CustomError extends Error{

    readonly isCustomError:boolean;
    readonly modifier?:string;

    constructor(msg:string,_modifier?:string,_isCustomError:boolean = true){
        super(msg);
        this.modifier = _modifier;
        this.isCustomError = _isCustomError;
    }
}