import Chat from "../business-logic/entity/Chat";
import Message from "../business-logic/entity/Message";
import User from "../business-logic/entity/User";

export interface Dao<T>{

    insert(o:T):Promise<T>;
    update(o:T):Promise<T>;
    delete(id:string):Promise<T>;
    get(id:string):Promise<T>;
    getAll(offset:number):Promise<T[]>;

}

export interface UserDao extends Dao<User> {}

export interface ChatDao extends Dao<Chat>{
    
    updateMessages(m:Message):Promise<boolean>;

}