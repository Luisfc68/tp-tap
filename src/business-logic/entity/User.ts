import { SubscriptionPlan } from "../bl.interfaces";
import Chat from "./Chat";
import Message from "./Message";

export default class User{

    private _imgUrl: string;
    private _username: string;
    private _password: string;
    private _email: string;
    private _id?: string;

    private _actualChat: Chat|null;
    private _favChats: Set<Chat>;

    private _plan: SubscriptionPlan;
    
    constructor(_imgUrl:string, _username:string, _password:string,_email: string,
        _plan:SubscriptionPlan,_favChats?:Set<Chat>,_id?:string){
        
            this._imgUrl = _imgUrl;
            this._username = _username;
            this._password = _password;
            this._email = _email;
            this._plan = _plan;
            this._id = _id;
            this._actualChat = null;
            this._favChats = _favChats || new Set<Chat>();

    }

    get imgUrl(): string {
        return this._imgUrl;
    }
    
    set imgUrl(value: string) {
        this._imgUrl = value;
    }
    
    get username(): string {
        return this._username;
    }
    
    set username(value: string) {
        this._username = value;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    get email(): string {
        return this._email;
    }
    
    set email(value: string) {
        this._email = value;
    }

    get plan(): SubscriptionPlan {
        return this._plan;
    }

    set plan(value: SubscriptionPlan) {
        this._plan = value;
    }

    get id(): string|undefined {
        return this._id;
    }

    set id(value: string|undefined) {
        this._id = value;
    }

    get actualChat(): Chat|null {
        return this._actualChat;
    }

    set actualChat(value: Chat|null) {
        this._actualChat = value;
    }

    get favChats(): Set<Chat>{
        return this._favChats;
    }
    
    set favChats(value: Set<Chat>) {
        this._favChats = value;
    }

    private write(content:string):Message{
        return new Message(content,this);
    }

    send(content:string){
        this._actualChat?.newMessage(this.write(content));
    }

    leaveChat(){
        this.actualChat?.removeUser(this);
    }

    cleanLeaveChat(){
        this.actualChat?.cleanMessages(this);
        this.leaveChat();
    }

}