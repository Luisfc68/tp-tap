import Chat from "../business-logic/entity/Chat";
import Message from "../business-logic/entity/Message";
import User from "../business-logic/entity/User";

export const PAGE_LIMIT:number = 5;

export const MESSAGE_LIMIT:number = 3; //PARA PROBAR ES 3, CAMBIAR A 10 LUEGO

export interface Dao<T>{

    insert(o:T):Promise<T>;
    update(o:T):Promise<T|null>;
    delete(id:string):Promise<T|null>;
    get(id:string):Promise<T|null>;
    getAll(offset:number):Promise<T[]>;

}

export interface UserDao extends Dao<User> {

    getByUsername(username:string):Promise<User|null>;

}

export interface ChatDao extends Dao<Chat>{
    
    insertMessage(chat:Chat,message:Message):Promise<Message|null>;
    cleanMessages(chat:Chat,user:User):Promise<boolean>;
    getMessages(chat:Chat,offset:number):Promise<Message[]>;
    chatQuery(offset: number,chat:{
        title?:string,
        description?:string,
        tags?:string[]
    }):Promise<Chat[]>;

}