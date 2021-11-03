import { Model, ObjectID, Ref, Unique } from "@tsed/mongoose";
import { ArrayOf, ForwardGroups, Groups, Name, Property, Required } from "@tsed/schema";
import { AppGroups } from "../GroupsEnum";
import Message from "./Message";
import User from "./User";

@Model({
    collection: "chats"
})
export default class Chat {

    @Unique()
    @Property()
    @Required()
    @Name("title")
    private _title: string;
    
    @Property()
    @Groups(AppGroups.NOT_USER,AppGroups.NOT_CHAT,AppGroups.NOT_MSG)
    @Name("imgUrl")
    private _imgUrl: string;

    @Property()
    @Required()
    @Name("description")
    private _description: string;

    @Property()
    @Required()
    @Name("tags")
    private _tags: string[];
    
    @ObjectID("id")
    readonly _id?: string;

    @Property()
    @ArrayOf(Message)
    @ForwardGroups()
    @Groups(AppGroups.MSG)
    @Name("messages")
    private _messages: Message[];

    @Ref(() => User)
    @Name("owner")                  // La politica por defecto es que si no tiene grupo pertenece a todos los grupos
    @Groups(AppGroups.NOT_USER)    // por eso es más fácil poner que a este no pertenece
    @ForwardGroups()
    private _owner: Ref<User>;

    private _users: Set<User>;
    
    constructor(_title: string,_description: string,_owner:User,
        _tags?: string[],_imgUrl?: string,_messages?:Message[],_id?: string) {
        
            this._title = _title;
            this._imgUrl = _imgUrl || process.env.DEFAULT_IMG_CHAT || "";
            this._description = _description;
            this._owner = _owner;
            this._tags = _tags || [];
            this._messages = _messages || [];
            this._id = _id;
            this._users = new Set<User>();

    }

    get title(): string {
        return this._title;
    }
    
    set title(value: string) {
        this._title = value;
    }

    get imgUrl(): string {
        return this._imgUrl;
    }
   
    set imgUrl(value: string) {
        this._imgUrl = value;
    }

    get description(): string {
        return this._description;
    }
    
    set description(value: string) {
        this._description = value;
    }

    get owner(): Ref<User> {
        return this._owner;
    }

    set owner(value: Ref<User>) {
        this._owner = value;
    }

    get tags(): string[] {
        return this._tags;
    }

    set tags(value: string[]) {
        this._tags = value;
    }

    get id(): string | undefined {
        return this._id;
    }

    get messages(): Message[] {
        return this._messages;
    }

    set messages(value: Message[]) {
        this._messages = value;
    }

    get users(): Set<User> {
        return this._users;
    }

    get connectedUsers(): number{
        return this._users.size;
    }

    cleanMessages(user:User):void{
        this.messages = this.messages.filter(m => !this.compareUser((<any>m)._user,user));
    }

    newMessage(msg:Message){
        this.messages.unshift(msg);
    }

    addUser(u:User){

        //Por si antes estaba en otro chat
        if(u.actualChat && u.actualChat !== this)
            u.leaveChat();

        this._users.add(u);
        u.actualChat = this;

    }

    removeUser(u:User){
        if(this._users.delete(u))
            u.actualChat = null;
    }

    private compareUser(u1:Ref<User>,u2:Ref<User>){

        const name1 = (<any>u1).username;      
        const name2 = (<any>u2).username;

        const id1 = (<any>u1)._id
        const id2 = (<any>u2)._id

        if(name1 && name2 && name1 === name2 )
            return true;
        if(id1 && id2 && id1 == id2)
            return true;
        if(u1 === u2)
            return true;

        return false;

    }

}