import { Ref, Schema } from "@tsed/mongoose";
import { Name, Property, Required } from "@tsed/schema";
import User from "./User";

@Schema()
export default class Message{
    
    @Property()
    @Required()
    @Name("timestamp")
    private _timestamp:number;

    @Property()
    @Required()
    @Name("content")
    private _content:string;

    @Ref(User)
    @Name("user")
    private _user:Ref<User>;

    constructor(_content:string,_user:User,_timestamp?:number) {
        this._user = this.user;
        this._content = _content;
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