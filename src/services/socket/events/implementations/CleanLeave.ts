import { Socket } from "socket.io";
import { Injectable } from "@tsed/di";
import { serialize } from "@tsed/json-mapper";
import User from "../../../../business-logic/entity/User";
import { AppGroups } from "../../../../business-logic/GroupsEnum";
import ChatSocketService from "../../ChatSocketService";
import { SocketEvents } from "../../SocketEvents";
import ChatEvent from "../ChatEvent";

@Injectable()
export default class CleanLeave extends ChatEvent{
    
    constructor() {
        super(SocketEvents.CLEAN_LEAVE);    
    }

    checkArgs(_args:any):boolean{
        return true;
    }

    executeEvent(socket:Socket,service:ChatSocketService,args:any):void{
        console.log(SocketEvents.CLEAN_LEAVE);
        let user:User|undefined = service.activeUsers.get(socket);

        if(!user || !user.actualChat) return;

        service.chatDao.cleanMessages(user.actualChat,user)
               .then(res => {

                    if(res === false) 
                        return;

                    const chatId = user!.actualChat?._id
                    
                    let serialized = serialize(user,{type: User,groups: [AppGroups.USER]});
                    if(chatId)
                        socket.to(chatId).emit(SocketEvents.CLEAN_LEAVE,serialized);
                    service.nextEvent(SocketEvents.LEAVE_ROOM,socket,args);
               })
               .catch(e => {
                   console.log(e)
                    socket.emit(SocketEvents.ERROR,e.message);
               });

    }

}