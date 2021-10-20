import { Injectable } from "@tsed/di";
import { Socket } from "socket.io";
import { serialize } from "@tsed/json-mapper";
import ChatSocketService from "../../ChatSocketService";
import { SocketEvents } from "../../SocketEvents";
import ChatEvent from "../ChatEvent";
import User from "../../../../business-logic/entity/User";
import { AppGroups } from "../../../../business-logic/GroupsEnum";
import Message from "../../../../business-logic/entity/Message";

@Injectable()
export default class MessageSent extends ChatEvent{

    constructor(){
        super(SocketEvents.MSG_SENT);
    }

    checkArgs(args:any):boolean{
        return args.content;
    }

    executeEvent(socket:Socket,service:ChatSocketService,args:any):void{
        console.log(SocketEvents.MSG_SENT);
        const serializationOps = {
            type: Message,
            groups: [AppGroups.MSG]
        };

        let user:User|undefined = service.activeUsers.get(socket);
        if(!user || !user.actualChat) return;

        let message:Message = user.write(args.content);
        service.chatDao.insertMessage(user.actualChat,message)
               .then(msg => {
                    let id:string|undefined =  user?.actualChat?.id;
                    
                    if(id)
                        socket.to(id).emit(SocketEvents.MSG_SENT,serialize(msg,serializationOps));
               });
    }

}