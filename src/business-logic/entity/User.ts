import { Model, ObjectID, Ref, Unique } from "@tsed/mongoose";
import { ArrayOf, ForwardGroups, Groups, Name, Property, Required } from "@tsed/schema";
import { SubscriptionPlan } from "../bl.interfaces";
import Chat from "./Chat";
import { AppGroups } from "../GroupsEnum";
import Message from "./Message";

@Model({
    collection: "users"
})
export default class User{

    @Property()
    @Groups(AppGroups.NOT_USER,AppGroups.NOT_CHAT,AppGroups.NOT_MSG)
    @Name("imgUrl")
    private _imgUrl: string;

    @Property()
    @Required()
    @Unique()
    @Name("username")
    private _username: string;

    @Property()
    @Groups(AppGroups.NOT_USER,AppGroups.NOT_CHAT,AppGroups.NOT_MSG)
    @Name("password")
    private _password: string;

    @Property()
    @Required()
    @Unique()
    @Groups(AppGroups.NOT_CHAT,AppGroups.NOT_MSG)
    @Name("email")
    private _email: string;
    
    @Ref(() => Chat) //La arrow function en ref indica referencia circular
    @Name("favChats")
    @ArrayOf(() => Chat).UniqueItems(true)
    @Groups(AppGroups.NOT_CHAT,AppGroups.NOT_MSG)
    @ForwardGroups()
    private _favChats: Ref<Chat>[];

    @ObjectID("id")
    readonly _id?: string;

    private _actualChat: Chat|null;
    
    @Property()
    @Groups(AppGroups.NOT_CHAT,AppGroups.NOT_MSG)
    @Name("planDetails")
    private _plan: SubscriptionPlan;
    
    constructor(_username:string, _password:string,_email: string,
        _plan:SubscriptionPlan,_imgUrl?:string,_favChats?:Ref<Chat>[],_id?:string){
        
            this._imgUrl = _imgUrl || process.env.DEFAULT_IMG_USER || "";
            this._username = _username;
            this._password = _password;
            this._email = _email;
            this._plan = _plan;
            this._id = _id;
            this._actualChat = null;
            this._favChats = _favChats || [];

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

    get actualChat(): Chat|null {
        return this._actualChat;
    }

    set actualChat(value: Chat|null) {
        this._actualChat = value;
    }

    get favChats(): Ref<Chat>[]{
        return this._favChats;
    }
    
    set favChats(value: Ref<Chat>[]) {
        this._favChats = value;
    }

    write(content:string):Message{
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

    addFavChat(chat: Ref<Chat>):void{
        if(this.favChats.filter(c => this.compareFavChat(c,chat)).length === 0)
            this.favChats.push(chat);
    }

    removeFavChat(chat: Ref<Chat>):void{
        let index = this.favChats.findIndex(c => this.compareFavChat(c,chat));

        if(index>-1)
            this.favChats.splice(index,1);
    }

    private compareFavChat(c1:Ref<Chat>,c2:Ref<Chat>){

        const title1 = (<any>c1)._title;
        const title2 = (<any>c2)._title;

        const id1 = (<any>c1)._id
        const id2 = (<any>c2)._id

        if(title1 && title2 && title1 === title2 )
            return true;
        if(id1 && id2 && id1 == id2)
            return true;
        if(c1 === c2)
            return true;

        return false;
    }

}