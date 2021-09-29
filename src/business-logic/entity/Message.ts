import User from "./User";

export default class Message{
    
    private _timestamp:number;

    constructor(
        private _content:string,
        private _user:User,
        _timestamp?:number
    ) {
        this._timestamp = _timestamp || Date.now();
    }

    get content(){
        return this._content;
    }

    get timestamp(){
        return this._timestamp;
    }

    get user(){
        return this._user;
    }

}