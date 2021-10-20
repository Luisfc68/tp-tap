import { $log } from "../../../node_modules/@tsed/logger/lib";
import Chat from "../../business-logic/entity/Chat";
import Message from "../../business-logic/entity/Message";
import User from "../../business-logic/entity/User";
import { ChatDao, MESSAGE_LIMIT } from "../da.interfaces";

export default class ProxyChatDao implements ChatDao{

    constructor(
        private original:ChatDao,
        private cache:Map<string,Chat>
    ){}

    insertMessage(chat: Chat, message: Message): Promise<Message | null> {
        return  this.original.insertMessage(chat,message)
                .then(msg => {
                    if(!msg)
                        return msg;
                    this.cache.get(chat.id!)?.newMessage(msg);
                    return msg;
                });
    }
    
    cleanMessages(chat: Chat, user: User): Promise<boolean> {
        return  this.original.cleanMessages(chat,user)
                .then(res => {
                    if(res === true)
                        this.cache.get(chat.id!)?.cleanMessages(user);
                    return res;
                });
    }

    private getCachedMessages(chat: Chat, offset: number):Message[]|null{
        if(!chat.id)
            return null;
        
        let cached = this.cache.get(chat.id);

        if(!cached)
            return null;
        
        $log.info("Cache used");
        return cached.messages.slice(offset,offset+MESSAGE_LIMIT);
    }

    getMessages(chat: Chat, offset: number): Promise<Message[]> {

        let cached:Message[]|null = this.getCachedMessages(chat,offset);
        let repeated = 0;

        if(cached !== null && cached.length === MESSAGE_LIMIT)
            return Promise.resolve(cached);
        else if(cached !== null)
            repeated = cached.length;

        return  this.original.getMessages(chat,offset)
                .then(messages => {

                    if(chat.id)
                        this.cache.get(chat.id)?.messages.push(...messages.slice(repeated));
                        
                    return messages;
                });

    }

    insert(o: Chat): Promise<Chat> {
        //metodo sin cache
        return this.original.insert(o);
    }

    update(o: Chat): Promise<Chat | null> {
        return  this.original.update(o)
                .then(updated => {
                    if(updated && updated.id)
                        this.cache.set(updated.id,updated);
                    return updated;
                });
    }

    delete(id: string): Promise<Chat | null> {
        return  this.original.delete(id)
                .then(deleted => {

                    if(deleted && deleted.id)
                        this.cache.delete(deleted.id);

                    return deleted;
                });
    }

    get(id: string): Promise<Chat | null> {

        let cached = this.cache.get(id);
        if(cached){
            $log.info("Cache used");
            return Promise.resolve(cached);
        }
        
        return this.original.get(id)
                .then(chat => {
                    if(chat && chat.id)
                        this.cache.set(chat.id,chat);
                    return chat;
                });
    }


    getAll(offset: number = 0): Promise<Chat[]> {
        //metodo sin cache
        return this.original.getAll(offset);
    }

}