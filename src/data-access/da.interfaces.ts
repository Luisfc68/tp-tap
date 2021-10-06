import Chat from "../business-logic/entity/Chat";
import Message from "../business-logic/entity/Message";
import User from "../business-logic/entity/User";

export const PAGE_LIMIT:number = 5;

export interface Dao<T>{

    insert(o:T):Promise<T>;
    update(o:T):Promise<T|null>;
    delete(id:string):Promise<T|null>;
    get(id:string):Promise<T|null>;
    getAll(offset:number):Promise<T[]>;

}

export interface UserDao extends Dao<User> {}

export interface ChatDao extends Dao<Chat>{
    
    updateMessages(m:Message):Promise<boolean>;

}