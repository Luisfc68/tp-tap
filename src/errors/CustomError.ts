export default abstract class CustomError extends Error{

    private _isCustomError:boolean;
    private _modifier?:string;

    constructor(msg:string,_modifier?:string,_isCustomError:boolean = true){
        super(msg);
        this._modifier = _modifier;
        this._isCustomError = _isCustomError;
    }

    get isCustomError(){
        return this._isCustomError;
    }

    get modifier(){
        return this._modifier;
    }

}