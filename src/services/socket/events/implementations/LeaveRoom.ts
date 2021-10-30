import { Socket } from "socket.io";
import { Injectable } from "@tsed/di";
import User from "../../../../business-logic/entity/User";
import ChatSocketService from "../../ChatSocketService";
import { SocketEvents } from "../../SocketEvents";
import ChatEvent from "../ChatEvent";
import { serialize } from "@tsed/json-mapper";
import { AppGroups } from "../../../../business-logic/GroupsEnum";

@Injectable()
export default class LeaveRoom extends ChatEvent{

    constructor(){
        super(SocketEvents.LEAVE_ROOM);
    }

    checkArgs(_args:any):boolean{
        return true;
    }

    executeEvent(socket:Socket,service:ChatSocketService,_args:any):void{
       console.log(SocketEvents.LEAVE_ROOM);
       let user:User|undefined = service.activeUsers.get(socket);

       if(!user) return;
       
       let chat = user.actualChat;

       if(!chat || !chat.id) return;

       user.leaveChat();
       if(chat.users.size === 0)
            service.activeChats.delete(chat.id); 
        else{
            socket.leave(chat.id);
            let serialized = serialize(user,{type: User,groups: [AppGroups.USER]})
            socket.to(chat.id).emit(SocketEvents.LEAVE_ROOM,serialized);
        }
    }
}