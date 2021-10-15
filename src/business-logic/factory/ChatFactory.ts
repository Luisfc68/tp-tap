import { Injectable } from "@tsed/di";
import { ErrorModifiers } from "../../errors/errorEnum";
import LogicError from "../../errors/LogicError";
import Chat from "../entity/Chat";
import Message from "../entity/Message";
import User from "../entity/User";

@Injectable()
export default class ChatFactory{

    createChat(title: string,description: string,owner:User,
        tags?: string[],imgUrl?: string,messages?:Message[],id?: string):Chat{
        
        return new Chat(title,description,owner,tags,imgUrl,messages,id);
    }
    
    //Usar este, el de arriba es para testing o casos puntuales
    createChatUsingSubscription(title: string,description: string,owner:User,
        tags?: string[],imgUrl?: string,messages?:Message[],id?: string):Chat{
        
        if(!owner.plan.canCreateChat())
            throw new LogicError("You can't create chats with your actual plan.",ErrorModifiers.MAX_CHAT);
        
        owner.plan.registerChatCreation();
        return this.createChat(title,description,owner,tags,imgUrl,messages,id);
    }

}