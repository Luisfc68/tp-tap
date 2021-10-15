import { Injectable } from "@tsed/di";
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
            throw new Error("You can't create chats with your actual plan.");
        
        owner.plan.registerChatCreation();
        return this.createChat(title,description,owner,tags,imgUrl,messages,id);
    }

}