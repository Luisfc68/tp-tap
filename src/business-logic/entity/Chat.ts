import Message from "./Message";
import User from "./User";

export default class Chat {

    private _title: string;
    private _imgUrl: string;
    private _description: string;
    private _tags: string[];
    private _id?: string | undefined;

    private _messages: Message[];
    private _owner: User;

    private _users: Set<User>;
    
    constructor(_title: string,_imgUrl: string,_description: string,_owner:User,
        _tags?: string[],_messages?:Message[],_id?: string) {
        
            this._title = _title;
            this._imgUrl = _imgUrl;
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

    get owner(): User {
        return this._owner;
    }

    set owner(value: User) {
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
    
    set id(value: string | undefined) {
        this._id = value;
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
        this.messages = this.messages.filter(m => m.user !== user);
    }

    newMessage(msg:Message){
        this.messages.push(msg);
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

}