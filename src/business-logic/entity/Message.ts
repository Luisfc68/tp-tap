import { ObjectID, Ref, Schema } from "@tsed/mongoose";
import { ForwardGroups, Name, Property, Required } from "@tsed/schema";
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
    @ForwardGroups()
    @Required()
    @Name("user")
    private _user:Ref<User>;

    @ObjectID("id")
    readonly _id?:string;

    constructor(content:string,user:Ref<User>,timestamp?:number,id?:string) {
        this._user = user;
        this._content = content;
        this._timestamp = timestamp || Date.now();
        this._id = id;
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

    get id(){
        return this._id;
    }

}